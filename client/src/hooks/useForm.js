/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useCallback } from "react";

export const useFormValidation = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateField = useCallback(
    (name, value) => {
      const rules = validationRules[name];
      if (!rules) return "";

      for (const rule of rules) {
        if (rule.required && (!value || value.trim() === "")) {
          return rule.message || `${name} مطلوب`;
        }

        if (rule.minLength && value.length < rule.minLength) {
          return (
            rule.message || `${name} يجب أن يكون أكثر من ${rule.minLength} أحرف`
          );
        }

        if (rule.maxLength && value.length > rule.maxLength) {
          return (
            rule.message || `${name} يجب أن يكون أقل من ${rule.maxLength} أحرف`
          );
        }

        if (rule.pattern && !rule.pattern.test(value)) {
          return rule.message || `${name} غير صالح`;
        }

        if (rule.custom && !rule.custom(value)) {
          return rule.message || `${name} غير صالح`;
        }
      }

      return "";
    },
    [validationRules]
  );

  const validateForm = useCallback(() => {
    const newErrors = {};
    let isValid = true;

    Object.keys(validationRules).forEach((name) => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [values, validateField]);

  const handleChange = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (name) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, values[name]);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (onSubmit) => {
    setIsSubmitting(true);

    // Mark all fields as touched
    const allTouched = Object.keys(validationRules).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (validateForm()) {
      try {
        await onSubmit(values);
      } catch (error) {
        console.error("Form submission error:", error);
      }
    }

    setIsSubmitting(false);
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  };

  const setFieldValue = (name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const setFieldError = (name, error) => {
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const isValid = Object.keys(errors).length === 0;
  const hasErrors = Object.keys(errors).some((key) => errors[key]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    hasErrors,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError,
    validateForm,
  };
};
