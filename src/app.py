from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_mail import Mail, Message

app = Flask(__name__)
CORS(app)

# Configure Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.office365.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'book-exchange-pi@outlook.com'
app.config['MAIL_PASSWORD'] = 'Alin12345'
app.config['MAIL_DEFAULT_SENDER'] = 'book-exchange-pi@outlook.com'

mail = Mail(app)

@app.route('/submit_form', methods=['POST', 'OPTIONS'])
def submit_form():
    if request.method == 'OPTIONS':
        response = app.response_class(
            response='',
            status=200,
        )
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Methods'] = 'POST'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
        return response

    try:
        data = request.get_json()
        # Process the form data as needed
        print(data)

        # Send a confirmation email
        send_confirmation_email(data['email'])

        return jsonify({'message': 'Form submitted successfully!'}), 200
    except Exception as e:
        print('Error submitting form:', e)
        return jsonify({'error': 'An error occurred. Please try again later.'}), 500

def send_confirmation_email(user_email):
    subject = 'Form Submission Confirmation'
    body = 'Your message has been registered. Thank you for submitting the form.'

    msg = Message(subject, recipients=[user_email], body=body)
    
    try:
        mail.send(msg)
        print(f"Confirmation email sent to {user_email}")
    except Exception as e:
        print(f"Error sending confirmation email to {user_email}: {e}")

if __name__ == '__main__':
    app.run(debug=True, port=5000)