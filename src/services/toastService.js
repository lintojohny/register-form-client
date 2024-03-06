export const showSuccessToast = (message, toast) => {
  toast.success(message, {
    position: "top-right",
    style: {
      backgroundColor: "#CDFADC",
      color: "#2c3642",
    },
  });
};

export const showErrorToast = (message, toast) => {
  toast.error(message, {
    position: "top-right",
    style: {
      backgroundColor: "#FFC0C0",
      color: "#2c3642",
    },
  });
};
