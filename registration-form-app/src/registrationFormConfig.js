export const REGISTRATION_DRAFT_KEY = "registration-form-draft";

export const DEFAULT_FORM_VALUES = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  role: "",
  terms: false,
};

export const VALID_ROLES = [
  "developer",
  "designer",
  "product-manager",
];

export const EMAIL_PATTERN =
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export const PASSWORD_PATTERN =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  