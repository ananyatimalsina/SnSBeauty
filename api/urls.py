from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="apiIndex"),
    path("getServices", views.getServices, name="getServices"),
    path("getServiceByName", views.getServiceByName, name="getServiceByName"),
    path("checkDate", views.checkDate, name="checkDate"),
    path("login", views.login, name="login"),
    path("signup", views.signup, name="signup"),
    path("verifySignup", views.verifySignup, name="verify"),
    path("getUser", views.getUser, name="getUser"),
    path("getVerification", views.getVerification, name="editUser"),
    path("editUser", views.editUser, name="verifyEditUser"),
    path("deleteUser", views.deleteUser, name="deleteUser"),
    path("resetPassword", views.resetPassword, name="resetPassword"),
    path("getAppointments", views.getAppointments, name="getAppointments"),
    path("addAppointment", views.addAppointment, name="addAppointment"),
    path("deleteAppointment", views.deleteAppointment, name="deleteAppointment"),
]