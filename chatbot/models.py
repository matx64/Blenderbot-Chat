from django.db import models


class Message(models.Model):
    text = models.CharField(max_length=200)
    author = models.CharField(max_length=4)
    sent_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"'{self.text}' sent at {self.sent_at.strftime('%m/%d/%Y %H:%M:%S')} by {self.author}"
