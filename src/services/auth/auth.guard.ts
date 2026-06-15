export const redirecAuthenticatedtUser = function () {
    const currentPath = window.location.pathname.toLowerCase();
    const isLoginPage = currentPath.includes("login") || currentPath.includes("bejelentkezes");
    const isRegisterPage = currentPath.includes("register") || currentPath.includes("regisztralas");
    if (isLoginPage || isRegisterPage) {
        window.location.href = "/letrehozas";
    };
};
export const redirecUnauthenticatedtUser = function () {
    const currentPath = window.location.pathname.toLowerCase();
    const isCreatePage = currentPath.includes("create") || currentPath.includes("letrehozas");
    const isProfilePage = currentPath.includes("profile") || currentPath.includes("profilom");
    const isTasksPage = currentPath.includes("tasks") || currentPath.includes("feladataim");
    if (isCreatePage || isProfilePage || isTasksPage) {
        window.location.href = "/bejelentkezes";
    };
};