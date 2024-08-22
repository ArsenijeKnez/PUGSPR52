using Common;
using Common.Dto;
using Common.Interface;
using Common.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Components.Routing;
using Microsoft.AspNetCore.Mvc;
using Microsoft.ServiceFabric.Services.Client;
using Microsoft.ServiceFabric.Services.Communication.Client;
using Microsoft.ServiceFabric.Services.Remoting.Client;
using System.IdentityModel.Tokens.Jwt;
using static System.Runtime.InteropServices.JavaScript.JSType;


namespace TaxiServiceControllers.Controllers
{

    [Route("api/user")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserServiceStatefull _userService = ServiceProxy.Create<IUserServiceStatefull>(new Uri("fabric:/TaxiServiceFabric/UserServiceStatefull"), new ServicePartitionKey(0), TargetReplicaSelector.PrimaryReplica);
        private readonly IFileStorageService _fileStorageService = new FileStorageService("C:/Databases/ProfileImages");


        [HttpPost("login")]
        public async Task<IActionResult> LoginUser([FromForm] UserLoginDto dto)
        {
            try
            {
                var userDto = await _userService.LoginUser(dto);

                if (userDto == null || userDto.Id == 0)
                    return NotFound("User doesn't exist!");

                string isVerified = "false";
                if (userDto.Verified != null)
                    isVerified = userDto.Verified.ToString();

                string token = TokenService.Token((int)userDto.Id, userDto.UserType, isVerified);
                if (token == string.Empty)
                    return BadRequest("Someting went wrong");
                else
                    return Ok(new LoginResponseDto() { Token = token, User = userDto });
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost("googleLogin")]
        public async Task<IActionResult> LoginGoogleUser([FromForm] GoogleLoginDto dto)
        {
            try
            {
                var userDto = await _userService.LoginGoogleUser(dto);

                if (userDto == null || userDto.Id == 0)
                    return NotFound("User doesn't exist!");

                string isVerified = "false";
                if (userDto.Verified != null)
                    isVerified = userDto.Verified.ToString();

                string token = TokenService.Token((int)userDto.Id, userDto.UserType, isVerified);
                if (token == string.Empty)
                    return BadRequest("Someting went wrong");
                else
                {
                    return Ok(new LoginResponseDto() { Token =token, User = userDto});
                }
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("updateProfile")]
        public async Task<IActionResult> UpdateProfile([FromForm] UserEditDto dto)
        {
            try
            {
                string url = string.Empty;
                if (dto.file != null)
                {
                    var fileUrl = await _fileStorageService.UploadFileAsync(dto.file);
                    url = fileUrl;
                }

                if (url == string.Empty)
                    return BadRequest("Failed to upload profie image");

                User data = ControllerMapper.editToUser(dto, url);
                var updatedUserDto = await _userService.EditUser(data);
                return Ok(updatedUserDto);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpGet("getUserData")]
        public async Task<IActionResult> GetUserData([FromQuery] string username)
        {
            try
            {
                var userDto = await _userService.GetUserByUsername(username);
                return Ok((userDto));
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [HttpGet("getDrivers")]
        public async Task<IActionResult> GetDrivers()
        {
            try
            {
                if (TokenService.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "user_role") != "Admin")
                    return Unauthorized("You don't have permission to read users data!");
                var sellers = await _userService.GetDrivers();
                return Ok(sellers);
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPut("verify/{username}/{v}")]
        public async Task<IActionResult> VerifyUser(string username, bool v)
        {
            
            if (TokenService.GetClaimValueFromToken(HttpContext.Request.Headers.Authorization, "user_role") != "Admin")
                return Unauthorized("You don't have permission to read user data!");

            try
            {
                UserDto user = await _userService.VerifyUser(username, v);

                if (user != null && user.Id != 0)
                {
                    string email = user.Email;
                    string poruka = $"Status Vašeg naloga je promenjen u: {(v ? "odobreno" : "odbijen")}";


                    await ServiceProxy.Create<IEmailServiceStateless>(new Uri("fabric:/TaxiServiceFabric/EmailServiceStateless")).AddEmail(email, poruka);

                    return Ok("Verification status has been updated!");
                }
                else
                    return NotFound("User profile couldn't be found!");
            }
            catch
            {
                return StatusCode(500);
            }
        }

        [HttpPut("changePassword")]
        public async Task<IActionResult> ChangePassword([FromForm] UserChangePasswordDto dto)
        {
            try
            {
                var user = await _userService.ChangePassword(dto.Username, dto.OldPassword, dto.NewPassword);
                if(user != null && user != new UserDto())
                    return Ok(user);
                else
                    return BadRequest();
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        

        //[HttpPost("login")]
        //public async Task<IActionResult> Login(UserLoginDto data)
        //{
        //    // Proverava da li je model validan
        //    if (ModelState.IsValid)
        //    {
        //        try
        //        {
        //            UserDto user = await _userService.LoginUser(data);
        //            if (user == null || user.Id == 0)
        //                return NotFound("User with provided email doesn't exist!");
        //            else
        //            {

        //                string token = TokenService.Token((int)user.Id, user.UserType);
        //                return token != string.Empty ? Ok(token) : BadRequest();
        //            }
        //        }
        //        catch
        //        {
        //            // Vraća status 500 u slučaju greške na serveru
        //            return StatusCode(500);
        //        }
        //    }
        //    else
        //    {
        //        // Vraća BadRequest ako je model nevalidan
        //        return BadRequest("Invalid request has been made!");
        //    }
        //}

        [HttpPost("register")]
        public async Task<IActionResult> Register(UserRegisterDto data)
        {

            if (ModelState.IsValid)
            {
                try
                {
                    string url = string.Empty;
                    if (data.file != null)
                    {
                        var fileUrl = await _fileStorageService.UploadFileAsync(data.file);
                        url = fileUrl;
                    }


                    if(url == string.Empty)
                           return BadRequest("Failed to upload profie image");
                    User newUser = ControllerMapper.ToUser(data, url);

                    UserDto user = await _userService.RegisterUser(newUser);

       
                    if (user == null || user.Id == 0)
                        return NotFound("User with provided email already exists!");
                    else
                    {
                        string isVerified = "false";
                        if (user.Verified != null)
                            isVerified = user.Verified.ToString();

                        string token = TokenService.Token((int)user.Id, user.UserType, isVerified);
               
                        return token != string.Empty ?  Ok(new LoginResponseDto() { Token = token, User = user }) : BadRequest();
                    }
                }
                catch
                { 
                    return StatusCode(500);
                }
            }
            else
            {
                return BadRequest("Invalid request has been made!");
            }
        }

        [HttpPost("registerGoogleUser")]
        public async Task<IActionResult> registerGoogle(RegisterUserGoogleDto data)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    string url = string.Empty;
                    if (data.file != null)
                    {
                        var fileUrl = await _fileStorageService.UploadFileAsync(data.file);
                        url = fileUrl;
                    }


                    if (url == string.Empty)
                        return BadRequest("Failed to upload profie image");
                    User newUser = ControllerMapper.GoogleToUser(data, url);

                    UserDto user = await _userService.RegisterUserGoogleAsync(newUser);


                    if (user == null || user.Id == 0)
                        return NotFound("User with provided email already exists!");
                    else
                    {
                        string isVerified = "false";
                        if (user.Verified != null)
                            isVerified = user.Verified.ToString();

                        string token = TokenService.Token((int)user.Id, user.UserType, isVerified);
                        return token != string.Empty ? Ok(new LoginResponseDto() { Token = token, User = user }) : BadRequest();
                    }
                }
                catch
                {
                    return StatusCode(500);
                }
            }
            else
            {
                return BadRequest("Invalid request has been made!");
            }
        }

    }
}

