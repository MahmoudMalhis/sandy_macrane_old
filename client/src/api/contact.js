const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

class ContactAPI {
  async makeRequest(endpoint, options = {}) {
    const token = localStorage.getItem("authToken");

    const defaultOptions = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Request failed");
    }

    return data;
  }

  async sendMessage(messageData) {
    return this.makeRequest("/contact", {
      method: "POST",
      body: JSON.stringify(messageData),
    });
  }

  async getAll(params = {}) {
    const queryParams = new URLSearchParams();

    if (params.page) queryParams.append("page", params.page);
    if (params.limit) queryParams.append("limit", params.limit);
    if (params.status) queryParams.append("status", params.status);
    if (params.priority) queryParams.append("priority", params.priority);
    if (params.search) queryParams.append("search", params.search);
    if (params.dateFrom) queryParams.append("dateFrom", params.dateFrom);
    if (params.dateTo) queryParams.append("dateTo", params.dateTo);

    const query = queryParams.toString();
    return this.makeRequest(`/contact/admin${query ? `?${query}` : ""}`);
  }

  async getById(id) {
    return this.makeRequest(`/contact/admin/${id}`);
  }

  async getStats() {
    return this.makeRequest("/contact/admin/stats");
  }

  async updateStatus(id, status, adminNotes = null) {
    return this.makeRequest(`/contact/admin/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, admin_notes: adminNotes }),
    });
  }

  async updatePriority(id, priority) {
    return this.makeRequest(`/contact/admin/${id}/priority`, {
      method: "PUT",
      body: JSON.stringify({ priority }),
    });
  }

  async updateNotes(id, notes) {
    return this.makeRequest(`/contact/admin/${id}/notes`, {
      method: "PUT",
      body: JSON.stringify({ admin_notes: notes }),
    });
  }

  async markAsRead(id) {
    return this.makeRequest(`/contact/admin/${id}/read`, {
      method: "PUT",
    });
  }

  async delete(id) {
    return this.makeRequest(`/contact/admin/${id}`, {
      method: "DELETE",
    });
  }

  async generateReplyTemplate(id) {
    return this.makeRequest(`/contact/admin/${id}/reply-template`);
  }
}

export const contactAPI = new ContactAPI();
