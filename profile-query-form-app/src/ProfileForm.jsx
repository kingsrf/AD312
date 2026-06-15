import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  EMPTY_PROFILE,
  USER_PROFILE_QUERY_KEY,
  fetchUserProfile,
  updateUserProfile,
} from "./api/profileApi.js";
import "./ProfileForm.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export default function ProfileForm() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    trigger,
    setError,
    clearErrors,
    formState: {
      errors,
      isDirty,
      isValid,
    },
  } = useForm({
    mode: "onChange",
    defaultValues: EMPTY_PROFILE,
  });

  const {
    data: profile,
    isLoading,
    isError,
    isFetching,
    error: queryError,
    refetch,
  } = useQuery({
    queryKey: USER_PROFILE_QUERY_KEY,
    queryFn: fetchUserProfile,
    retry: false,
    staleTime: 30_000,
  });

  const updateMutation = useMutation({
    mutationFn: updateUserProfile,

    onSuccess: async (updatedProfile) => {
      await queryClient.invalidateQueries({
        queryKey: USER_PROFILE_QUERY_KEY,
      });

      reset(updatedProfile);
      await trigger();
    },

    onError: (error) => {
      if (error.status === 409 && error.field === "email") {
        setError(
          "email",
          {
            type: "server",
            message: error.message,
          },
          {
            shouldFocus: true,
          }
        );

        return;
      }

      setError("root.server", {
        type: "server",
        message:
          error.message ||
          "The profile could not be saved. Please try again.",
      });
    },
  });

  useEffect(() => {
    if (!profile || isDirty) {
      return;
    }

    reset(profile);
    void trigger();
  }, [profile, isDirty, reset, trigger]);

  function clearServerFeedback(fieldName) {
    if (fieldName && errors[fieldName]?.type === "server") {
      clearErrors(fieldName);
    }

    clearErrors("root.server");

    if (updateMutation.isError || updateMutation.isSuccess) {
      updateMutation.reset();
    }
  }

  function cancelChanges() {
    if (!profile) {
      return;
    }

    reset(profile);
    clearErrors();
    updateMutation.reset();
    void trigger();
  }

  function onSubmit(formValues) {
    clearErrors("root.server");
    updateMutation.mutate(formValues);
  }

  if (isLoading) {
    return (
      <main className="profile-page">
        <section className="status-card" role="status">
          <div className="loading-spinner" aria-hidden="true" />
          <h1>Loading profile...</h1>
          <p>Retrieving the latest profile information.</p>
        </section>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="profile-page">
        <section className="status-card error-card" role="alert">
          <h1>Profile unavailable</h1>

          <p>
            {queryError?.message ||
              "Unable to load the profile. Make sure JSON Server is running."}
          </p>

          <button
            className="primary-button"
            type="button"
            onClick={() => refetch()}
          >
            Try Again
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="profile-page">
      <section className="profile-card">
        <header className="profile-header">
          <span className="eyebrow">Account settings</span>
          <h1>Edit User Profile</h1>

          <p>
            Profile data is loaded from JSON Server and synchronized through
            TanStack Query.
          </p>
        </header>

        <form
          className="profile-form"
          aria-label="Edit user profile"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          {isFetching && !updateMutation.isPending && (
            <p className="refresh-message" role="status">
              Refreshing profile data...
            </p>
          )}

          <div className="form-field">
            <label htmlFor="username">Username</label>

            <input
              id="username"
              type="text"
              autoComplete="username"
              placeholder="Enter a username"
              aria-invalid={Boolean(errors.username)}
              aria-describedby={
                errors.username ? "username-error" : undefined
              }
              {...register("username", {
                required: "Username is required.",
                minLength: {
                  value: 3,
                  message: "Username must contain at least 3 characters.",
                },
                onChange: () => clearServerFeedback(),
              })}
            />

            {errors.username && (
              <p
                id="username-error"
                className="field-error"
                role="alert"
              >
                {errors.username.message}
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
                onChange: () => clearServerFeedback("email"),
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

          <div className="form-field">
            <label htmlFor="bio">Bio</label>

            <textarea
              id="bio"
              rows="6"
              placeholder="Tell us a little about yourself"
              aria-invalid={Boolean(errors.bio)}
              aria-describedby={errors.bio ? "bio-error" : "bio-help"}
              {...register("bio", {
                maxLength: {
                  value: 500,
                  message: "Bio cannot exceed 500 characters.",
                },
                onChange: () => clearServerFeedback(),
              })}
            />

            <p id="bio-help" className="field-help">
              Optional. Maximum 500 characters.
            </p>

            {errors.bio && (
              <p id="bio-error" className="field-error" role="alert">
                {errors.bio.message}
              </p>
            )}
          </div>

          <div className="checkbox-field">
            <input
              id="notifications"
              type="checkbox"
              {...register("notifications", {
                onChange: () => clearServerFeedback(),
              })}
            />

            <div>
              <label htmlFor="notifications">
                Enable email notifications
              </label>

              <p>
                Receive account updates and important activity alerts.
              </p>
            </div>
          </div>

          {errors.root?.server && (
            <p className="server-error" role="alert">
              {errors.root.server.message}
            </p>
          )}

          {updateMutation.isSuccess && !isDirty && (
            <p className="success-message" role="status">
              Profile saved successfully.
            </p>
          )}

          <div className="form-actions">
            <button
              className="primary-button"
              type="submit"
              disabled={
                !isDirty ||
                !isValid ||
                updateMutation.isPending
              }
            >
              {updateMutation.isPending
                ? "Saving..."
                : "Save Changes"}
            </button>

            <button
              className="secondary-button"
              type="button"
              onClick={cancelChanges}
              disabled={!isDirty || updateMutation.isPending}
            >
              Cancel Changes
            </button>
          </div>

          <p className="form-status" aria-live="polite">
            {updateMutation.isPending
              ? "Your profile changes are being saved."
              : isDirty
                ? "You have unsaved profile changes."
                : "Your profile is up to date."}
          </p>
        </form>
      </section>
    </main>
  );
}
