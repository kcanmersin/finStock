using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.DTOs.Users
{
    public class UserRegistrationDto
    {
        [DefaultValue("superadmin@gmail.com")]
        public string Email { get; set; }

        [DefaultValue("123456")]
        public string Password { get; set; }
        [DefaultValue("Admin")]
        public string RoleName { get; set; }
    }
}
