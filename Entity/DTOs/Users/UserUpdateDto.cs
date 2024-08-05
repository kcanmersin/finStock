using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entity.DTOs.Users
{
    public class UserUpdateDto
    {
        public Guid UserId { get; set; }
        public string NewEmail { get; set; }
        public string NewPassword { get; set; }
    }
}
