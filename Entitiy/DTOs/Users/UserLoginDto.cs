using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.DTOs.Users
{
    public class UserLoginDto
    {
        //admin id cb94223b-ccb8-4f2f-93d7-0df96a7f065c
        //admin gmail 
        //superadmin@gmail.com
        //pass 123456
        [DefaultValue("superadmin@gmail.com")]
        public string Email { get; set; }
        [DefaultValue("123456")]
        public string Password { get; set; }
        public bool RememberMe { get; set; }
    }
}
