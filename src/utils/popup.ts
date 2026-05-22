export const showErrorPopUp = function (message: string) {
    const infoMessageDiv = document.getElementById("errorMessage");
    if (infoMessageDiv) {
        infoMessageDiv.textContent = message;
    };
};
export const showInfoPopUp = function (message: string) {
    const infoMessageDiv = document.getElementById("infoMessage");
    if (infoMessageDiv) {
        infoMessageDiv.textContent = message;
    };

}