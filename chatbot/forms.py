from django import forms


class MessageForm(forms.Form):
    user_message = forms.CharField(label=None, max_length=200)
