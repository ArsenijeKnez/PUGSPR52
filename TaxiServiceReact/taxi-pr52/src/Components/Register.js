import { RegisterUser } from "../Services/UserService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button } from 'react-bootstrap';
import { GoogleLogin } from "@react-oauth/google";
import '../Styles/signup.css'
 
function Register() {
    const [errorMessages, setErrorMessages] = useState({});
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const nav = useNavigate();

    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div style={{ color: 'red', fontSize: '15px' }}>{errorMessages.message}</div>
        );

    function validate(event) {
        var valid = true;
        const username = event.target.username.value;
        const password = event.target.password.value;
        const password2 = event.target.password2.value;
        const email = event.target.email.value;
        const name = event.target.name.value;
        const lastname = event.target.lastname.value;
        const date = event.target.date.value;
        const usertype = event.target.usertype.value;
        const address = event.target.address.value;

        if (username.trim() === "") {
            setErrorMessages({ name: "username", message: "Username is required!" });
            valid = false;
        }
        if (password.trim() === "") {
            setErrorMessages({ name: "password", message: "Password is required!" });
            valid = false;
        }
        if (email.trim() === "") {
            setErrorMessages({ name: "email", message: "Email is required!" });
            valid = false;
        }
        if (name.trim() === "") {
            setErrorMessages({ name: "name", message: "Name is required!" });
            valid = false;
        }
        if (lastname.trim() === "") {
            setErrorMessages({ name: "lastname", message: "Lastname is required!" });
            valid = false;
        }
        if (usertype.trim() === "") {
            setErrorMessages({ name: "usertype", message: "User Type is required!" });
            valid = false;
        }
        if (address.trim() === "") {
            setErrorMessages({ name: "address", message: "Address is required!" });
            valid = false;
        }
        if (!date) {
            setErrorMessages({ name: "date", message: "Date of birth is required!" });
            valid = false;
        }
        const y = new Date(date).getFullYear();

        if (y > 2020 || y < 1900) {
            setErrorMessages({ name: "date", message: "Date is out of bounds!" });
            valid = false;
        }
        if (!file) {
            setErrorMessages({ name: "picture", message: "Picture is required!" });
            valid = false;
        }
        if(password2 !== password){
            setErrorMessages({ name: "password", message: "Passwords do not match" });
            valid = false;
        }
        return valid;


    }
    const reg = async (data) => {
        const r = await RegisterUser(data);
        if(r.status === 200){
            toast.success('successful registration!');
            nav('/home/profile');
        }
        else {
            toast.error('failed registration!');
            console.log("error");
        }

    }
    function handleSubmit(event) {
        event.preventDefault();

        setErrorMessages({ name: "username", message: "" })
        setErrorMessages({ name: "password", message: "" })
        setErrorMessages({ name: "email", message: "" })
        setErrorMessages({ name: "name", message: "" })
        setErrorMessages({ name: "lastname", message: "" })
        setErrorMessages({ name: "date", message: "" })
        setErrorMessages({ name: "address", message: "" })
        setErrorMessages({ name: "usertype", message: "" })
        setErrorMessages({ name: "picture", message: "" });
        if (validate(event)) {
            const formData = new FormData();
            formData.append('Username', event.target.username.value);
            formData.append('Name', event.target.name.value);
            formData.append('Lastname', event.target.lastname.value);
            formData.append('Password', event.target.password.value);
            formData.append('Birthday', event.target.date.value);
            formData.append('Email', event.target.email.value);
            formData.append('Address', event.target.address.value);
            formData.append('UserType', event.target.usertype.value);
            formData.append('file', file);

            reg(formData, event.target.username.value);

        }
    }
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        let value = URL.createObjectURL(event.target.files[0]);
        setImage(value);
    };
    function googleLoginHandle(response) {
        console.log(response.credential);
        nav('/googleregister', { state: response.credential });
    }
    function googleLoginErrorHandle() {
        toast.error('Google login error');
    }
    return (
        <>
        <Form onSubmit={handleSubmit}>
            <div className="form-container">
                <div className="form-content">
                    <Form.Group controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" name="username" />
                        {renderErrorMessage("username")}
                    </Form.Group>

                    <Form.Group controlId="name">
                        <Form.Label>Name</Form.Label>
                        <Form.Control type="text" name="name" />
                        {renderErrorMessage("name")}
                    </Form.Group>

                    <Form.Group controlId="lastname">
                        <Form.Label>Lastname</Form.Label>
                        <Form.Control type="text" name="lastname" />
                        {renderErrorMessage("lastname")}
                    </Form.Group>

                    <Form.Group controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" />
                        {renderErrorMessage("email")}
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" />
                        {renderErrorMessage("password")}
                    </Form.Group>

                    <Form.Group controlId="password2">
                        <Form.Label>Password check</Form.Label>
                        <Form.Control type="password" name="password2" />
                        {renderErrorMessage("password check")}
                    </Form.Group>

                    <Form.Group controlId="date">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control type="date" name="date" />
                        {renderErrorMessage("date")}
                    </Form.Group>

                    <Form.Group controlId="address">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" name="address" />
                        {renderErrorMessage("address")}
                    </Form.Group>

                    <Form.Group controlId="usertype">
                        <Form.Label>User Type</Form.Label>
                        <Form.Control as="select" name="usertype">
                            <option value="User">User</option>
                            <option value="Driver">Driver</option>
                            <option value="Admin">Admin</option>
                        </Form.Control>
                        {renderErrorMessage("usertype")}
                    </Form.Group>

                    <Form.Group controlId="picture">
                        <Form.Label>Profile Picture</Form.Label><br />
                        {image && <img src={image} alt="Preview" width="50px" height="50px" />}
                        <div className="mb-3">
                            <Form.Control type="file" name="image" accept=".jpg,.jpeg,.png" onChange={handleFileChange} />
                        </div>
                        {renderErrorMessage("picture")}
                    </Form.Group>

                    <Button variant="outline-success" type="submit" className="w-100">
                        Register
                    </Button>
                    <p>Or register with Google:</p>
                    <GoogleLogin onSuccess={googleLoginHandle} onError={googleLoginErrorHandle} />
                </div>
            </div>
        </Form>
    </>
    );
}

export default Register;