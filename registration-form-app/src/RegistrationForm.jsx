import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import {
  DEFAULT_FORM_VALUES,
  EMAIL_PATTERN,
  PASSWORD_PATTERN,
  REGISTRATION_DRAFT_KEY,
  VALID_ROLES,
} from "./registrationFormConfig.js";
import "./RegistrationForm.css";

function wait(milliseconds) {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

export default function RegistrationForm({ submissionDelay = 2000 }) {
  const draftReadyRef = useRef(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setFocus,
    reset,
    clearErrors,
    formState: {
      errors,
      isSubmitting,
      isValid,
    },
  } = useForm({
    mode: "onChange",
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const password = watch("password");

  useEffect(() => {
    let isActive = true;

    async function loadSavedDraft() {
      // Simulates loading saved data asynchronously.
      await wait(0);

      if (!isActive) {
        return;
      }

      const savedDraft = localStorage.getItem(REGISTRATION_DRAFT_KEY);

      if (!savedDraft) {
        draftReadyRef.current = true;
        return;
      }

      try {
        const parsedDraft = JSON.parse(savedDraft);

        setValue(
          "fullName",
          typeof parsedDraft.fullName === "string"
            ? parsedDraft.fullName
            : "",
          {
            shouldValidate: false,
            shouldDirty: false,
            shouldTouch: false,
          }
        );

        setValue(
          "email",
          typeof parsedDraft.email === "string"
            ? parsedDraft.email
            : "",
          {
            shouldValidate: false,
            shouldDirty: false,
            shouldTouch: false,
          }
        );

        setValue(
          "role",
          VALID_ROLES.includes(parsedDraft.role)
            ? parsedDraft.role
            : "",
          {
            shouldValidate: false,
            shouldDirty: false,
            shouldTouch: false,
          }
        );

        setValue("terms", parsedDraft.terms === true, {
          shouldValidate: false,
          shouldDirty: false,
          shouldTouch: false,
        });

        // Draft values can load without immediately displaying old errors.
        clearErrors();
      } catch {
        localStorage.removeItem(REGISTRATION_DRAFT_KEY);
        reset(DEFAULT_FORM_VALUES);
        clearErrors();
      } finally {
        draftReadyRef.current = true;
      }
    }

    loadSavedDraft();

    return () => {
      isActive = false;
    };
  }, [clearErrors, reset, setValue]);

  useEffect(() => {
    const subscription = watch((formValues) => {
      if (!draftReadyRef.current) {
        return;
      }

      /*
       * Passwords are intentionally excluded from localStorage.
       * Sensitive credentials should not be stored in browser storage.
       */
      const safeDraft = {
        fullName: formValues.fullName || "",
        email: formValues.email || "",
        role: formValues.role || "",
        terms: formValues.terms === true,
      };

      const hasDraftContent =
        safeDraft.fullName.trim() !== "" ||
        safeDraft.email.trim() !== "" ||
        safeDraft.role !== "" ||
        safeDraft.terms;

      if (hasDraftContent) {
        localStorage.setItem(
          REGISTRATION_DRAFT_KEY,
          JSON.stringify(safeDraft)
        );
      } else {
        localStorage.removeItem(REGISTRATION_DRAFT_KEY);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [watch]);

  function clearDraft() {
    draftReadyRef.current = false;

    localStorage.removeItem(REGISTRATION_DRAFT_KEY);

    reset(DEFAULT_FORM_VALUES, {
      keepErrors: false,
      keepDirty: false,
      keepTouched: false,
      keepIsSubmitted: false,
      keepIsValid: false,
    });

    clearErrors();

    requestAnimationFrame(() => {
      draftReadyRef.current = true;
      setFocus("fullName");
    });
  }

  async function onSubmit(formData) {
    await wait(submissionDelay);

    const registrationPayload = {
      fullName: formData.fullName.trim(),
      email: formData.email.trim(),
      role: formData.role,
      terms: formData.terms,
    };

    console.log("Registration submitted:", registrationPayload);

    draftReadyRef.current = false;

    localStorage.removeItem(REGISTRATION_DRAFT_KEY);

    reset(DEFAULT_FORM_VALUES, {
      keepErrors: false,
      keepDirty: false,
      keepTouched: false,
      keepIsSubmitted: false,
      keepIsValid: false,
    });

    clearErrors();

    requestAnimationFrame(() => {
      draftReadyRef.current = true;
      setFocus("fullName");
    });
  }

  return (
    <main className="registration-page">
      <section className="registration-card">
        <div className="registration-header">
          <span className="eyebrow">Create your account</span>

          <h1>User Registration</h1>

          <p>
            Complete the form below. Your non-sensitive progress is
            automatically saved.
          </p>
        </div>

        <form
          aria-label="User registration form"
          className="registration-form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <div className="form-field">
            <label htmlFor="fullName">Full Name</label>

            <input
              id="fullName"
              type="text"
              autoComplete="name"
              placeholder="Enter your full name"
              autoFocus
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={
                errors.fullName ? "fullName-error" : undefined
              }
              {...register("fullName", {
                required: "Full name is required.",
                minLength: {
                  value: 3,
                  message: "Full name must be at least 3 characters.",
                },
                setValueAs: (value) => value.trimStart(),
              })}
            />

            {errors.fullName && (
              <p
                id="fullName-error"
                className="field-error"
                role="alert"
              >
                {errors.fullName.message}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={
                errors.email ? "email-error" : undefined
              }
              {...register("email", {
                required: "Email address is required.",
                pattern: {
                  value: EMAIL_PATTERN,
                  message: "Enter a valid email address.",
                },
                setValueAs: (value) => value.trim(),
              })}
            />

            {errors.email && (
              <p
                id="email-error"
                className="field-error"
                role="alert"
              >
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="password-grid">
            <div className="form-field">
              <label htmlFor="password">Password</label>

              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Create a secure password"
                aria-invalid={Boolean(errors.password)}
                aria-describedby={
                  errors.password
                    ? "password-error"
                    : "password-help"
                }
                {...register("password", {
                  required: "Password is required.",
                  minLength: {
                    value: 8,
                    message:
                      "Password must be at least 8 characters.",
                  },
                  pattern: {
                    value: PASSWORD_PATTERN,
                    message:
                      "Password must include uppercase, lowercase, and a number.",
                  },
                })}
              />

              <p id="password-help" className="field-help">
                At least 8 characters with uppercase, lowercase, and a
                number.
              </p>

              {errors.password && (
                <p
                  id="password-error"
                  className="field-error"
                  role="alert"
                >
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Repeat your password"
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={
                  errors.confirmPassword
                    ? "confirmPassword-error"
                    : undefined
                }
                {...register("confirmPassword", {
                  required: "Please confirm your password.",
                  validate: (value) =>
                    value === password ||
                    "Passwords do not match.",
                  deps: ["password"],
                })}
              />

              {errors.confirmPassword && (
                <p
                  id="confirmPassword-error"
                  className="field-error"
                  role="alert"
                >
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="role">Role / Account Type</label>

            <select
              id="role"
              aria-invalid={Boolean(errors.role)}
              aria-describedby={
                errors.role ? "role-error" : undefined
              }
              {...register("role", {
                required: "Please select an account role.",
                validate: (value) =>
                  VALID_ROLES.includes(value) ||
                  "Please select a valid role.",
              })}
            >
              <option value="">Select a role...</option>
              <option value="developer">Developer</option>
              <option value="designer">Designer</option>
              <option value="product-manager">
                Product Manager
              </option>
            </select>

            {errors.role && (
              <p
                id="role-error"
                className="field-error"
                role="alert"
              >
                {errors.role.message}
              </p>
            )}
          </div>

          <div className="terms-field">
            <input
              id="terms"
              type="checkbox"
              aria-invalid={Boolean(errors.terms)}
              aria-describedby={
                errors.terms ? "terms-error" : undefined
              }
              {...register("terms", {
                required:
                  "You must accept the Terms and Conditions.",
                validate: (value) =>
                  value === true ||
                  "You must accept the Terms and Conditions.",
              })}
            />

            <label htmlFor="terms">
              I agree to the Terms and Conditions.
            </label>
          </div>

          {errors.terms && (
            <p
              id="terms-error"
              className="field-error terms-error"
              role="alert"
            >
              {errors.terms.message}
            </p>
          )}

          <div className="form-actions">
            <button
              className="submit-button"
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              {isSubmitting ? "Registering..." : "Register"}
            </button>

            <button
              className="clear-button"
              type="button"
              onClick={clearDraft}
              disabled={isSubmitting}
            >
              Clear Draft
            </button>
          </div>

          <p className="form-status" aria-live="polite">
            {isSubmitting
              ? "Your registration is being processed."
              : isValid
                ? "Your form is ready to submit."
                : "Complete all required fields to register."}
          </p>
        </form>
      </section>
    </main>
  );
}
