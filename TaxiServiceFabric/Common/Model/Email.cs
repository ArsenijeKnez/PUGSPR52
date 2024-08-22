using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;

namespace Common.Model
{
    public class Email
    {
        [DataMember]
        public int Id { get; set; }

        [DataMember]
        public string Receipent { get; set; } = string.Empty;

        [DataMember]
        public string Message { get; set; } = string.Empty;

        [DataMember]
        public bool Sent { get; set; } = false;

    }
}
