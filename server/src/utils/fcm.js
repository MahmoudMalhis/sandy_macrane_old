import fetch from "node-fetch";
import db from "../db/knex.js";
import { info, error as logError } from "./logger.js";

const SERVICE_ACCOUNT = {
  type: "service_account",
  project_id: "sandy-macram",
  private_key_id: "cc436ab7aead5353516892807501d90fa560c764",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCk+fCfDpfFwxns\nS13wC6gPSlgmMPN0OEQVCSkDeBEhosX8WyF30DO/ooYiSyxT6707cb2Y/SVGGu/F\nH+Cr2vYRsWEPV/6tZAoa1dze85Oc0CIMIqeZMKNsYRpSEhzXEWD/UyeKF2liDTIU\nQMVlc/gfmipu+tdK5fM+Dv770JOueAU/BlrbwBAooitAPjQVvqpUEQpJLhCPwRg7\nbCiY1aAlNcQoE+rNS9uW2Abwlvs12hl3ZH/9SEk+8kv1XN/3JZdrwRsMrieeSDZX\nZo3SfJKW2Zk8ZNwJRz+QRoKz24AInp8HbPfSCD00kqwu9GM/8tJDWP6Cv3DB1132\nozzPR6FrAgMBAAECggEAAV+SYP0HOKIAssv5Xxpn9b31W6wHweZcOrpgkiMLSlpj\n3N20c542hWaIum0+N6rYtfoxFEy6untWekwN29lEVHVf/pQJnLMCDE3OkKnlFVhu\nM67FR7pKXmvt2GJjGqD/9mAnf+KPyOgPNuKc7Lhj+X2YKNWuK8qNzkI5QSp+N1aw\nGygGw/CagPhTj0ZURPG6MfjNvGRuhaLTMLEHuigxG4j93dYzqZIgfIdemnuGLLG6\n1iaJJsq3ca2GxOCypoiIHAQ/OYM8cOjlRI1eko7MjQNMx0k598muZecMAxV8LoHo\njyS+fdGJWG5CnHTEe48L6c3wzg/n02YnpyHLrVasIQKBgQDjg/zgI0DW7EbwnoSb\nOMlt2zQ1dPT4jmngwKvvl+BTQgOnEyJxilZxM9BBb4Iz9b6CqOZ8IQ85vXvaUk4W\nIU1o6nDWwWvMD4Ec/9/dDgrNneGTHUCd1oaAFAhaivE+YGdwLz7oIze2j+8sbY7U\nh3LBPMmyftbKtNBhpY203NBDgwKBgQC5oYgBC5bKYYGqz/jLXH2DUCSbVSKO2WVt\ng2ge5he+eA6F6JftHZ9Bg/H3uxqEnoX2lspBmEvS8bsOl7uxRh4O9vqy1gtSNWkq\nmSFTrqHyUScmlvQar2ydD4imlh7YBytrqmqb4UV//BqC9vlLaciUA+rGVLPv5Hj8\n9tSamhV9+QKBgQDBxL+yBVRLt6ATfm5h5NNpBLBKdvnMVz5FdNL6k9cyEZ8axGkp\nWjCU6RQNJvM1Xa6LiV4DigR1oLPDFSX8IxDSshi4TrOIcAv+rs3ybus0g6qCqP9H\nblXO70DOHFeqUGDIYvSosJXanmuM4yIqT9GkUilWJEC7E5QGFgHCb+3QEQKBgCce\nfl3SBmYB5GSNzV110VGB6yT87Ppzn+dTQPb6AFj4Tf80RAgJLQ2Oc8iEGpOGIK8V\nmev230vF+2iY20oBf8YhkDVt3BboAJCkkpxi+efp6Dk+qJSTEW2L331Tt45I/IKE\n+FB/Sbkt9JxS1bhpw4ZFyQ0gvoa4fDK7BZTLEeppAoGAc4O/FoDWZERnXsjJ1Hah\n3+6qM96j8BiOGQSvdI4SDLUAmwqjtJQKUFXhpwYFsNvbRHivtds8xZNXalUK3z5z\nNPUMMCGxpyJrvKBMSTUTqDh/5ZQVIOJKNqRjMHiEkfMqc9SIp6pFbGELa42kgRwE\nJPepClYxNNIbkgUrsioCxPk=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@sandy-macram.iam.gserviceaccount.com",
  client_id: "109195872119227501997",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40sandy-macram.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
};

const PROJECT_ID = SERVICE_ACCOUNT.project_id;
const FCM_API_URL = `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`;

async function getAccessToken() {
  try {
    const jwtHeader = Buffer.from(
      JSON.stringify({ alg: "RS256", typ: "JWT" })
    ).toString("base64url");

    const now = Math.floor(Date.now() / 1000);
    const jwtPayload = Buffer.from(
      JSON.stringify({
        iss: SERVICE_ACCOUNT.client_email,
        scope: "https://www.googleapis.com/auth/firebase.messaging",
        aud: SERVICE_ACCOUNT.token_uri,
        exp: now + 3600,
        iat: now,
      })
    ).toString("base64url");

    const { createSign } = await import("crypto");
    const sign = createSign("RSA-SHA256");
    sign.update(`${jwtHeader}.${jwtPayload}`);
    sign.end();
    const signature = sign.sign(SERVICE_ACCOUNT.private_key, "base64url");

    const jwt = `${jwtHeader}.${jwtPayload}.${signature}`;

    const response = await fetch(SERVICE_ACCOUNT.token_uri, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    logError("Error getting access token:", error);
    throw error;
  }
}

export async function sendNotificationToToken(
  fcmToken,
  notification,
  data = {}
) {
  try {
    const accessToken = await getAccessToken();

    const message = {
      message: {
        token: fcmToken,
        notification: {
          title: notification.title,
          body: notification.body,
          image: notification.image || undefined,
        },
        data: data,
        webpush: {
          fcm_options: {
            link: notification.link || "/admin",
          },
          notification: {
            icon: "/logo.png",
            badge: "/logo.png",
            requireInteraction: true,
          },
        },
      },
    };

    const response = await fetch(FCM_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(message),
    });

    const result = await response.json();

    if (!response.ok) {
      if (
        result.error?.code === "NOT_FOUND" ||
        result.error?.code === "INVALID_ARGUMENT" ||
        result.error?.details?.[0]?.errorCode === "UNREGISTERED"
      ) {
        await removeInvalidToken(fcmToken);
      }
      throw new Error(result.error?.message || "Failed to send notification");
    }

    info("FCM notification sent successfully", {
      token: fcmToken.slice(0, 20),
    });
    return result;
  } catch (error) {
    logError("Error sending FCM notification:", error);
    throw error;
  }
}

export async function sendNotificationToAllAdmins(notification, data = {}) {
  try {
    const tokens = await db("admin_fcm_tokens").select("fcm_token").distinct();

    if (!tokens || tokens.length === 0) {
      info("No admin FCM tokens found");
      return { success: 0, failed: 0 };
    }

    info(`Sending notification to ${tokens.length} admin device(s)`);

    const results = await Promise.allSettled(
      tokens.map(({ fcm_token }) =>
        sendNotificationToToken(fcm_token, notification, data)
      )
    );

    const success = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    info("Batch notification results", { success, failed });

    return { success, failed, total: tokens.length };
  } catch (error) {
    logError("Error sending batch notifications:", error);
    throw error;
  }
}

export async function saveFcmToken(adminId, fcmToken, deviceInfo = null) {
  try {
    const existing = await db("admin_fcm_tokens")
      .where({ admin_id: adminId, fcm_token: fcmToken })
      .first();

    if (existing) {
      await db("admin_fcm_tokens")
        .where({ id: existing.id })
        .update({ last_used_at: db.fn.now() });

      info("FCM token updated", { adminId });
      return existing;
    }

    const [id] = await db("admin_fcm_tokens").insert({
      admin_id: adminId,
      fcm_token: fcmToken,
      device_info: deviceInfo,
    });

    info("FCM token saved", { adminId, tokenId: id });

    return await db("admin_fcm_tokens").where({ id }).first();
  } catch (error) {
    logError("Error saving FCM token:", error);
    throw error;
  }
}

export async function removeFcmToken(fcmToken) {
  try {
    const deleted = await db("admin_fcm_tokens")
      .where({ fcm_token: fcmToken })
      .del();

    info("FCM token removed", { deleted });
    return deleted;
  } catch (error) {
    logError("Error removing FCM token:", error);
    throw error;
  }
}

async function removeInvalidToken(fcmToken) {
  try {
    await db("admin_fcm_tokens").where({ fcm_token: fcmToken }).del();
    info("Invalid FCM token removed", { token: fcmToken.slice(0, 20) });
  } catch (error) {
    logError("Error removing invalid token:", error);
  }
}

export async function notifyNewInquiry(inquiry) {
  const notification = {
    title: "📩 طلب جديد",
    body: `تم استلام طلب جديد من ${inquiry.name}`,
    link: "/admin/inquiries",
  };

  const data = {
    type: "new_inquiry",
    inquiry_id: String(inquiry.id),
    timestamp: new Date().toISOString(),
  };

  return await sendNotificationToAllAdmins(notification, data);
}

export async function notifyNewReview(review) {
  const notification = {
    title: "⭐ تقييم جديد",
    body: `تقييم جديد من ${review.author_name} - ${review.rating} نجوم`,
    link: "/admin/testimonials",
  };

  const data = {
    type: "new_review",
    review_id: String(review.id),
    rating: String(review.rating),
    timestamp: new Date().toISOString(),
  };

  return await sendNotificationToAllAdmins(notification, data);
}
