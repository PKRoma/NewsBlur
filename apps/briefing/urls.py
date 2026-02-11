from django.urls import re_path

from apps.briefing import views

urlpatterns = [
    re_path(r"^stories$", views.load_briefing_stories, name="load-briefing-stories"),
    re_path(r"^preferences$", views.briefing_preferences, name="briefing-preferences"),
    re_path(r"^status$", views.briefing_status, name="briefing-status"),
    re_path(r"^generate$", views.generate_briefing, name="generate-briefing"),
]
