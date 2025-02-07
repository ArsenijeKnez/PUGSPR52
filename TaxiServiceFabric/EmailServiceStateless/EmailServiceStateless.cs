using System;
using System.Collections.Generic;
using System.Fabric;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Common.Model;
using EmailServiceStateless.EmailServiceDB;
using Microsoft.ServiceFabric.Services.Communication.Runtime;
using Microsoft.ServiceFabric.Services.Runtime;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit.Text;
using MimeKit;
using System.Linq;
using System.Text;
using System;
using Common.Interface;
using Microsoft.ServiceFabric.Services.Remoting.Runtime;


namespace EmailServiceStateless
{
    /// <summary>
    /// An instance of this class is created for each service instance by the Service Fabric runtime.
    /// </summary>
    internal sealed class EmailServiceStateless : StatelessService, IEmailServiceStateless
    {
        private static string senderAddress = "";
        private static string senderAppPassword = "";
        private static string smtpServerAddress = "smtp.gmail.com";
        private static int smtpServerPortNumber = 587;

        public EmailServiceStateless(StatelessServiceContext context) : base(context) { }

        public async Task AddEmail(string email, string message)
        {
            try
            {
                await new EmailRepository().InsertEmailAsync(new Email() { Message = message, Receipent = email });
            }
            catch { }
        }

        protected override IEnumerable<ServiceInstanceListener> CreateServiceInstanceListeners()
        {
            return this.CreateServiceRemotingInstanceListeners();
        }

        protected override async Task RunAsync(CancellationToken cancellationToken)
        {
            while (true)
            {
                Email email = await new EmailRepository().GetUnsentEmailsAsync();

                if (email.Id != 0 && await SendEmail(email.Message, email.Receipent, "Verifikacija vaseg naloga je promenjena"))
                    await new EmailRepository().UpdateEmailStatusAsync(email.Id, true);

                cancellationToken.ThrowIfCancellationRequested();
                await Task.Delay(TimeSpan.FromSeconds(15), cancellationToken);
            }
        }

        public static async Task<bool> SendEmail(string message, string to, string subject)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(senderAddress));
                email.To.Add(MailboxAddress.Parse(to));
                email.Subject = subject;
                email.Body = new TextPart(TextFormat.Plain) { Text = message };

                using (var smtp = new SmtpClient())
                {
                    await smtp.ConnectAsync(smtpServerAddress, smtpServerPortNumber, SecureSocketOptions.StartTls);
                    await smtp.AuthenticateAsync(senderAddress, senderAppPassword);
                    await smtp.SendAsync(email);
                    await smtp.DisconnectAsync(true);
                }

                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
