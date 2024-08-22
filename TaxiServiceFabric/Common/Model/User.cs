using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Common.Dto;
using System.Runtime.Serialization;

namespace Common.Model
{
    [DataContract]
    public class User
    {
        [DataMember]
        public long Id { get; set; }
        [DataMember]
        public string Username { get; set; }
        [DataMember]
        public string Name { get; set; }
        [DataMember]
        public string Lastname { get; set; }
        [DataMember]
        public string Password { get; set; }
        [DataMember]
        public string Address { get; set; }
        [DataMember]
        public DateTime Birthday { get; set; }
        [DataMember]
        public string UserType { get; set; }
        [DataMember]
        public string Email { get; set; }
        [DataMember]
        public string ProfilePictureUrl { get; set; }
        [DataMember(IsRequired = false)]
        public int? RideDataID { get; set; }
        [DataMember]
        public bool? Verified { get; set; }

    }
}
