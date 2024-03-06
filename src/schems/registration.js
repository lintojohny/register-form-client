import * as yup from "yup";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const validationSchema = yup
  .object({
    fullName: yup
      .string()
      .required("Missing full name")
      .matches(
        /^[a-zA-Z0-9@]+$/,
        "This field cannot contain white space and special character"
      ),
    contactNumber: yup
      .string()
      .required("Missing contact number")
      .matches(phoneRegExp, "Phone number is not valid")
      .min(10, "Too short, Enter valid 10 digit phone number")
      .max(10, "Too long, Enter valid 10 digit phone number"),

    email: yup
      .string()
      .required("Missing email")
      .email("Sorry, this email address is not valid. Please try again."),
    password: yup
      .string()
      .required("Missing password")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  })
  .required();
