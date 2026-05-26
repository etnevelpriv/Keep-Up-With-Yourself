export const setupPasswordVisibilityToggle = function () {
    document.getElementById("passwordVisibilityToggle")?.addEventListener("click", () => {
        const passwordInput = document.getElementById("passwordInput") as HTMLInputElement
        const passwordIcon = document.getElementById("passwordIcon");
        if (passwordInput.type == "text") {
            passwordInput.type = "password"
            passwordIcon?.classList.remove("fa-eye")
            passwordIcon?.classList.add("fa-eye-slash")
        } else {
            passwordInput.type = "text";
            passwordIcon?.classList.remove("fa-eye-slash")
            passwordIcon?.classList.add("fa-eye")
        };
    });
};