import Select from "react-select";
import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, Controller } from "react-hook-form";

import "./register.css";
import logo from "../../../public/logo.png";
import { useDates } from "../../hooks/useDates";
import { postAPI } from "../../services/apiService";
import { validationSchema } from "../../schems/registration";
import { showSuccessToast, showErrorToast } from "../../services/toastService";

function useMedia(query) {
  const [matches, setMatches] = useState(window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => setMatches(media.matches);
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [query, matches]);

  return matches;
}

const Register = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitted },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      contactNumber: "",
      password: "",
      day: "",
      month: "",
      year: "",
    },
  });

  const small = useMedia("(max-width: 640px)");

  const { setDay, setMonth, setYear, setError, days, months, years, error } =
    useDates();
  const typeObj = {
    day: setDay,
    month: setMonth,
    year: setYear,
    error: setError,
  };

  const handleTypeSelect = (e, type) => {
    // selectedOption.type = e.value

    typeObj[type](e.value);
    setValue(type, e.value);
  };

  const onSubmit = (data) => {
    data.birthDate = `${data.year}/${data.month
      .toString()
      .padStart(2, "0")}/${data.day.toString().padStart(2, "0")}`;

    postAPI(data)
      .then(() => {
        showSuccessToast("User account successfully created.", toast);
      })
      .catch((err) => {
        showErrorToast("There is an error creating the account.", toast);
        // to update the form status
        Object.keys(err).forEach((key) => {
          setError(key, {
            type: "server",
            message: err[key][0],
          });
        });
      });
  };

  const handleReset = () => {
    reset(); // Reset the form
    setDay("");
    setMonth("");
    setYear("");
    setValue("day", "");
    setError(null);
  };

  return (
    <>
      <Toaster position={small ? "top-left" : "top-right"}></Toaster>

      <div className="header">
        <img src={logo} alt="logo" className="logo" />
      </div>

      <div className="register-form">
        <div className="form-heading">Create User Account</div>
        <div className="form-wrapper">
          <form className="form">
            <div className="input-container">
              <div className="input-text">Full Name</div>
              <input
                type="text"
                id="input-field"
                data-testid={"fullName"}
                {...register("fullName")}
                required
                className={
                  errors.fullName ? "register-input  invalid" : "register-input"
                }
              />
              <label
                htmlFor="input-field"
                className={errors.fullName ? "label error" : "label"}
              >
                Full Name
                <span className="input-required">*</span>
              </label>

              {errors.fullName && (
                <span className="error">{errors.fullName.message}</span>
              )}
            </div>

            <div className="input-container">
              <div className="input-text">Contact Number</div>
              <input
                type="text"
                id="input-field"
                data-testid={"contactNumber"}
                {...register("contactNumber")}
                required
                className={
                  errors.contactNumber
                    ? "register-input  invalid"
                    : "register-input"
                }
              />
              <label
                htmlFor="input-field"
                className={errors.contactNumber ? "label error" : "label"}
              >
                Contact Number
                <span className="input-required">*</span>
              </label>

              {errors.contactNumber && (
                <span className="error">{errors.contactNumber.message}</span>
              )}
            </div>

            <div className="input-container ">
              <div className="input-text">Birth date</div>
              <div className="date-container">
                <div className="date-dropdowns">
                  <Controller
                    control={control}
                    name="day"
                    render={() => {
                      return (
                        <Select
                          className={`basic-single day-input ${
                            error && isSubmitted ? "invalid" : ""
                          }`}
                          classNamePrefix="day"
                          name="day"
                          options={days}
                          onChange={(e) => handleTypeSelect(e, "day")}
                          placeholder={
                            <span>
                              Day<span className="input-required">*</span>
                            </span>
                          }
                          isOptionDisabled={(option) => option.disable}
                        />
                      );
                    }}
                  />
                  <Controller
                    control={control}
                    name="day"
                    render={() => {
                      return (
                        <Select
                          className={`basic-single month-input ${
                            error && isSubmitted ? "invalid" : ""
                          }`}
                          classNamePrefix="month"
                          name="month"
                          placeholder={
                            <span>
                              Month<span className="input-required">*</span>
                            </span>
                          }
                          options={months}
                          onChange={(e) => handleTypeSelect(e, "month")}
                          isOptionDisabled={(option) => option.disable}
                        />
                      );
                    }}
                  />

                  <Controller
                    control={control}
                    name="year"
                    render={() => {
                      return (
                        <Select
                          className={`basic-single year-input${
                            error && isSubmitted ? "invalid" : ""
                          }`}
                          classNamePrefix="year"
                          name="year"
                          placeholder={
                            <span>
                              Year<span className="input-required">*</span>
                            </span>
                          }
                          options={years}
                          onChange={(e) => handleTypeSelect(e, "year")}
                          isOptionDisabled={(option) => option.disable}
                        />
                      );
                    }}
                  />
                </div>
              </div>
              {error && isSubmitted ? (
                <span className="error">{error}</span>
              ) : null}
            </div>

            <div className="input-container">
              <div className="input-text">Email Address</div>
              <input
                type="text"
                id="input-field"
                {...register("email")}
                required
                data-testid={"email"}
                className={
                  errors.email ? "register-input  invalid" : "register-input"
                }
              />
              <label
                htmlFor="input-field"
                className={errors.email ? "label error" : "label"}
              >
                Email Address
                <span className="input-required">*</span>
              </label>

              {errors.email && (
                <span className="error">{errors.email.message}</span>
              )}
            </div>

            <div className="input-container">
              <div className="input-text">Password</div>
              <input
                type="password"
                id="input-field"
                {...register("password")}
                required
                data-testid={"password"}
                className={
                  errors.password ? "register-input  invalid" : "register-input"
                }
              />
              <label
                htmlFor="input-field"
                className={errors.password ? "label error" : "label"}
              >
                Password
                <span className="input-required">*</span>
              </label>

              {errors.password && (
                <span className="error">{errors.password.message}</span>
              )}
            </div>

            <div className="input-container">
              <div className="input-text">Confirm Password</div>
              <input
                type="password"
                id="input-field"
                data-testid={"confirmPassword"}
                {...register("confirmPassword")}
                required
                className={
                  errors.confirmPassword
                    ? "register-input  invalid"
                    : "register-input"
                }
              />
              <label
                htmlFor="input-field"
                className={errors.confirmPassword ? "label error" : "label"}
              >
                Confirm password
                <span className="input-required">*</span>
              </label>

              {errors.confirmPassword && (
                <span className="error">{errors.confirmPassword.message}</span>
              )}
            </div>

            <div></div>
          </form>
        </div>
        <div className="button-parent">
          <button type="button" className="button" onClick={handleReset}>
            Cancel
          </button>
          <button
            type="submit"
            className="button1"
            onClick={handleSubmit(onSubmit)}
          >
            Submit
          </button>
        </div>
      </div>
    </>
  );
};
export default Register;
