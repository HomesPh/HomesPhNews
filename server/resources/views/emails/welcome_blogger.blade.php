<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <title>Welcome to Homes.ph News</title>
    <style>
        @media only screen and (max-width: 600px) {
            h1 {
                font-size: 20px !important;
            }
            p, span, td {
                font-size: 14px !important;
            }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f7f9; -webkit-font-smoothing: antialiased;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f4f7f9;">
        <tr>
            <td align="center" style="padding: 40px 0;">
                <!-- Main Container -->
                <table border="0" cellpadding="0" cellspacing="0" width="600" style="background-color: #ffffff; border-top: 5px solid #C10007; overflow: hidden;">
                    
                    <!-- Header -->
                    <tr>
                        <td align="center" style="background-color: #111827; padding: 24px 20px;">
                            <img src="http://localhost:3000/images/HomesLogo.png" alt="Homes.ph News" style="display: block; max-height: 24px; width: auto; border: 0;" />
                        </td>
                        
                    </tr>

                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px 30px; color: #1f2937; line-height: 1.6;">
                            <h1 style="margin: 0 0 10px 0; font-size: 24px; font-weight: 800; color: #111827; letter-spacing: -0.025em;">Welcome, {{ $firstName }}!</h1>
                            
                            <p style="margin: 0 0 30px 0; font-size: 16px; color: #4b5563;">
                                Your blogger account has been created on Homes.ph News. Use the credentials below to access your dashboard:
                            </p>
                            
                            <!-- Credentials Card -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 30px;">
                                <tr>
                                    <td style="padding: 20px;">
                                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                            <tr>
                                                <td width="100" style="font-weight: 600; color: #374151; padding-bottom: 10px;">Email:</td>
                                                <td style="padding-bottom: 10px;">
                                                    <span style="color: #111827; font-family: monospace; background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 14px;">
                                                        {{ $email }}
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="100" style="font-weight: 600; color: #374151;">Password:</td>
                                                <td>
                                                    <span style="color: #111827; font-family: monospace; background: #f3f4f6; padding: 2px 6px; border-radius: 4px; font-size: 14px;">
                                                        {{ $password }}
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0 0 30px 0; font-size: 16px; color: #4b5563;">
                                For security reasons, we strongly recommend that you change your password immediately after your first login.
                            </p>

                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <a href="{{ $loginUrl }}" style="display: inline-block; background-color: #c10007; color: #ffffff; padding: 14px 28px; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 16px;">
                                            Login to Your Account
                                        </a>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td align="center" style="background-color: #111827; padding: 60px 40px;">
                            <a href="#" style="display: inline-flex; align-items: center; justify-content: center; text-decoration: none; opacity: 0.6; margin-bottom: 30px;">
                                <img src="http://localhost:3000/images/HomesLogo.png" alt="Homes.ph News" style="max-height: 30px; width: auto; border: 0;" />
                            </a>
                            <p style="margin: 0; font-size: 12px; color: #64748b; line-height: 1.6;">
                                &copy; {{ date('Y') }} Homes.ph News. All rights reserved.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
