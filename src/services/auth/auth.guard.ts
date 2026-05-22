export const redirecAuthenticatedtUser = function () {
    const currentPath = window.location.pathname.toLowerCase();
    const isLoginPage = currentPath.includes("login");
    const isRegisterPage = currentPath.includes("register");
    if (isLoginPage || isRegisterPage) {
        window.location.href = "/pages/create.html";
    };
};
export const redirecUnauthenticatedtUser = function () {
    const currentPath = window.location.pathname.toLowerCase();
    const isCreatePage = currentPath.includes("create");
    const isProfilePage = currentPath.includes("profile");
    const isTasksPage = currentPath.includes("tasks");
    if (isCreatePage || isProfilePage || isTasksPage) {
        window.location.href = "/pages/login.html";
    };
}