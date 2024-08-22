import { useState } from "react";
import '../Styles/ALL.css';
import { LoginUser, LoginUserGoogle } from "../Services/UserService";
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';
import { Form, Button } from 'react-bootstrap';
import { GoogleLogin } from "@react-oauth/google";
import { toast } from 'react-toastify';
import jwt_decode from "jwt-decode";

function Login() {
    const [errorMessages, setErrorMessages] = useState({});
    const navigate = useNavigate();
    //toast.configure();
    const renderErrorMessage = (name) =>
    name === errorMessages.name && (
        <div style={{ color: 'red', fontSize: '15px' }}>{errorMessages.message}</div>
    );
    function validate(event)
    {
        var valid = true;
        if(event.target.username.value.trim()==="")
        {
            valid = false;
            setErrorMessages({ name: "username", message: "Username is required!" });
        }
        if(event.target.password.value.trim()==="")
        {
            valid = false;
            setErrorMessages({ name: "password", message: "Password is required!" });
        }
        return valid;
    }
    const login = async(data) =>
    {
        const r = await LoginUser(data);
        if(r && r.status === 200)
          navigate('/home/profile');
    }
    const handleSubmit = (event) =>
    {
        event.preventDefault();
        setErrorMessages({ name: "username", message: "" })
        setErrorMessages({ name: "password", message: "" })
        if(validate(event))
        {
            var formData = new FormData();
            const u = event.target.username.value;
            formData.append("username",u);
            formData.append("password",event.target.password.value);
            login(formData);

        }
    }
    const googleLoginHandle = async(response)=>
    {
      const token = response.credential;
      const t = jwt_decode(token);
      var fd = new FormData();
      fd.append('Email',t.email);
      fd.append('Token',token);
      const r = await LoginUserGoogle(fd);
      if(r && r.status === 200)
        navigate("/home/profile")
    }
    function googleLoginErrorHandle()
    {
        toast.error('Google login error');
    }
    return (
        <div className="container mt-5 ">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <Form onSubmit={handleSubmit} className="bg-light border border-gray rounded">
              <div className="card">
                <div className="card-body">
                  <h3 className="card-title">Login</h3>
                  <Form.Group controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control type="text" name="username"/>
                    {renderErrorMessage("username")}
                  </Form.Group>
                  <Form.Group controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" name="password"/>
                    {renderErrorMessage("password")}
                  </Form.Group>
                  <Form.Group>
                    <Button variant="success" type="submit" className="mt-2">
                      Login
                    </Button>
                  </Form.Group>
                  <div>
                    Don't have an account? Go to{" "}
                    <a href="/register" className="link-dark">
                      Registration
                    </a>
                  </div>
                  <br/>
                  <p>Or login with google:</p>
                <GoogleLogin onSuccess={googleLoginHandle} onError={googleLoginErrorHandle}/>
                </div>

              </div>
            </Form>
          </div>
        </div>
      </div>
        // <div>
        // <form onSubmit={handleSubmit}>
        //     <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        //         <div style={{ flexDirection: 'column', border: '3px solid #b0b0b0', borderRadius: '5px', padding: '10px', width: '400px', margin: '200px', backgroundColor: '#ededed' }}>
        //             <div style={{ margin: '5px' }}>username <input type='text' name="username"/>{renderErrorMessage("username")}</div>
        //             <div style={{ margin: '5px' }}>password <input type='password' name="password"/>{renderErrorMessage("password")}</div>
        //             <div style={{ margin: '5px' }}><input type='submit' value="Login"/></div>
        //             <div style={{ margin: '5px' }}>Don't have an account? Go to <a href='/register'>Registration</a></div>
        //         </div>
        //     </div>
        // </form>
        // </div>
    )
}

export default Login;