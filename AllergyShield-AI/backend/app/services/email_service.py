import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timedelta
import secrets
from sqlalchemy.orm import Session
from app.models.user import User

class EmailService:
    def __init__(self, smtp_server="smtp.gmail.com", smtp_port=587, sender_email="your_email@gmail.com", password="your_app_password"):
        self.smtp_server = smtp_server
        self.smtp_port = smtp_port
        self.sender_email = sender_email
        self.password = password
    
    def send_reset_email(self, user_email: str, reset_link: str):
        """Send password reset email"""
        # If no credentials configured, just log the link
        if not self.password:
            print("\n" + "="*60)
            print("EMAIL NOT CONFIGURED - Reset Link for Testing:")
            print(f"Email: {user_email}")
            print(f"Link: {reset_link}")
            print("="*60 + "\n")
            return True
        
        try:
            message = MIMEMultipart()
            message["From"] = self.sender_email
            message["To"] = user_email
            message["Subject"] = "Reset Your AllergyShield Password"
            
            body = f"""
            <html>
              <body style="font-family: Arial, sans-serif;">
                <div style="max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #16a34a;">Password Reset Request</h2>
                  <p>You requested to reset your AllergyShield password. Click the link below to proceed:</p>
                  <div style="margin: 20px 0;">
                    <a href="{reset_link}" style="background-color: #16a34a; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
                  </div>
                  <p><strong>Link expires in 1 hour.</strong></p>
                  <p style="color: #666;">If you didn't request this, you can safely ignore this email.</p>
                  <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
                  <p style="font-size: 12px; color: #999;">AllergyShield AI</p>
                </div>
              </body>
            </html>
            """
            
            message.attach(MIMEText(body, "html"))
            
            with smtplib.SMTP(self.smtp_server, self.smtp_port) as server:
                server.starttls()
                server.login(self.sender_email, self.password)
                server.send_message(message)
            
            return True
        except Exception as e:
            print(f"Email send failed: {e}")
            return False
    
    def generate_reset_token(self, db: Session, user_email: str) -> str:
        """Generate and save reset token"""
        user = db.query(User).filter(User.email == user_email).first()
        if not user:
            return None
        
        reset_token = secrets.token_urlsafe(32)
        user.reset_token = reset_token
        user.reset_token_expires = datetime.utcnow() + timedelta(hours=1)
        
        db.commit()
        return reset_token
    
    def verify_reset_token(self, db: Session, token: str):
        """Verify reset token is valid and not expired"""
        user = db.query(User).filter(User.reset_token == token).first()
        
        if not user:
            return None
        
        if user.reset_token_expires < datetime.utcnow():
            return None
        
        return user
