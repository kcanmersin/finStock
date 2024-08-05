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
        //admin gmail 
        //superadmin@gmail.com
        //pass 123456

        [DefaultValue("superadmin@gmail.com")]
        public string Email { get; set; }
           
        [DefaultValue("123456")]
        public string Password { get; set; }
    }
}
