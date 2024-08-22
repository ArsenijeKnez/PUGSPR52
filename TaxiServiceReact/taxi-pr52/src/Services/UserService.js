import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import jwt from 'jsonwebtoken';
import jwt_decode from "jwt-decode";
import {User} from "../Model/User";

function decodeToken(token) {
  try {
      const decoded = jwt_decode(token);
      return decoded;
  } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
  }
}


const handleApiError = (error) => {
  const errorMessage = error.response?.data || error.message;
  toast.error(errorMessage);
  return errorMessage;
};

// const verifyToken = (token) => {
//   const secretKey = process.env.REACT_APP_SECRET_KEY;
//   const issuer = process.env.REACT_APP_ISSUER;

//   try {
//     const decodedToken = jwt.verify(token, secretKey, { issuer });
//     const currentTime = Math.floor(Date.now() / 1000);

//     if (decodedToken.exp && decodedToken.exp < currentTime) {
//       throw new Error('Error: Expired token');
//     }

//     return decodedToken;
//   } catch (err) {
//     toast.error('Error: Expired or invalid token');
//     throw err;
//   }
// };

export const RegisterUser = async (data) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/register`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if(response.status === 200){
      const decodedToken = decodeToken(response.data.token);

      const user = User.fromObject(response.data.user);

      localStorage.setItem('encodedToken', JSON.stringify(response.data.token));
      localStorage.setItem('token', JSON.stringify(decodedToken));
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('googleuser', 'false');
      return response;
      }
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const LoginUser = async (data) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/login`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if(response.status === 200){
      const decodedToken = decodeToken(response.data.token);

      const user = User.fromObject(response.data.user);
      localStorage.setItem('encodedToken', JSON.stringify(response.data.token));
      localStorage.setItem('token', JSON.stringify(decodedToken));
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('googleuser', 'false');
      return response;
      }
    else {
      toast.error('User not found!');
      return response;
    }
  } catch (error) {
    return handleApiError(error);
  }
};


export const GetUserData = async (username) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/getUserData`, {
      params: { username },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};


export const EditProfile = async (data) => {
  try {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/user/updateProfile`, data);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const GetDrivers = async () => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/getDrivers`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': JSON.parse(localStorage.getItem('encodedToken')),
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};


export const VerifyUser= async (username, v) => {
  try {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/user/verify/${username}/${v}`, [], {
      headers: {
        'Content-Type': 'application/json',
        'Authorization':  JSON.parse(localStorage.getItem('encodedToken')),
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const ChangeUserPassword = async (data) => {
  try {
    const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/user/changePassword`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response;
  } catch (error) {
    return handleApiError(error);
  }
};

export const RegisterGoogle = async (data) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/registerGoogleUser`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if(response.status === 200){
      const decodedToken = decodeToken(response.data.token);

      const user = User.fromObject(response.data.user);
      console.log(response.data);
      localStorage.setItem('encodedToken', JSON.stringify(response.data.token));
      localStorage.setItem('token', JSON.stringify(decodedToken));
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('googleuser', 'false');
      return response;
    }
    return response;
    
  } catch (error) {
    return handleApiError(error);
  }
};

export const LoginUserGoogle = async (data) => {
  try {
    const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/googleLogin`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if(response.status === 200){
      const decodedToken = decodeToken(response.data.token);

      const user = User.fromObject(response.data.user);

      localStorage.setItem('encodedToken', JSON.stringify(response.data.token));
      localStorage.setItem('token', JSON.stringify(decodedToken));
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('googleuser', 'false');
      return response;

    }
  } catch (error) {
    return handleApiError(error);
  }
};



/* 

export const RegisterUser = async (data) => {
  return await axios.post(`${process.env.REACT_APP_API_URL}/api/users/register`, data,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(function (response) {
      //console.log(response);
      return response;

    })
    .catch(function (error) {
      if (error.response.data)
        toast.error(error.response.data)
      else
        toast.error(error)
      return null;
    });

}

export const LoginUser = async (data, navigate, u) => {
  return await axios.post(`${process.env.REACT_APP_API_URL}/api/users/login`, data,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(function (response) {


      if (response.data) {
        const secretKey = process.env.REACT_APP_SECRET_KEY;
        const issuer = process.env.REACT_APP_ISSUER;

        try {

          const decodedToken = jwt.verify(response.data, secretKey, { issuer: issuer });


          const currentTime = Math.floor(Date.now / 100);
          if (decodedToken.exp && decodedToken.exp < currentTime) {
            throw new Error('Error: Expired token');
          }
          else {
            navigate("../home")
            localStorage.setItem('encodedToken', JSON.stringify(response.data));
            localStorage.setItem('token', JSON.stringify(decodedToken));
            localStorage.setItem('user', u);
            const t = 'false';
            localStorage.setItem('googleuser', t);
            return response;
          }
        }
        catch (err) {
          console.log(err);
          toast.error('Error:expired od invalid token');
          throw new Error('Error:expired od invalid token');
        }
      }
      else {
        toast.error('invalid data!');
        return response;
      }
    })
    .catch(function (error) {
      if (error.response.data)
        toast.error(error.response.data)
      else
        toast.error(error)
    });

}

export const GetUserData = async (data) => {
  return await axios.get(`${process.env.REACT_APP_API_URL}/api/users/getUserData`,
    {
      params:
      {
        username: data
      }
    })
}
export const EditProfile = async (data) => {
  return await axios.put(`${process.env.REACT_APP_API_URL}/api/users/updateProfile`, data).then(function (response) {
    return response;

  }).catch(function (error) {
    if (error.response.data)
      toast.error(error.response.data)
    else
      toast.error(error)
    return null;
  });
}

export const GetDrivers = async () => {

  return await axios.get(`${process.env.REACT_APP_API_URL}/api/users/getDrivers`
    ,
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('encodedToken'))}`
      }
    }).then(function (response) {
      return response;

    })
    .catch(function (error) {
      if (error.response.data)
        toast.error(error.response.data)
      else
        toast.error(error)
    });
}

export const VerifySeller = async (username, v) => {

  return await axios.put(`${process.env.REACT_APP_API_URL}/api/users/verify/${username}/${v}`, [],
    {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${JSON.parse(localStorage.getItem('encodedToken'))}`
      }
    }).then(function (response) {
      return response;

    })
    .catch(function (error) {
      if (error.response.data)
        toast.error(error.response.data)
      else
        toast.error(error)
    });
}

export const ChangeUserPassword = async (data) => {
  //console.log(data);
  return await axios.put(`${process.env.REACT_APP_API_URL}/api/users/changePassword`, data,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(function (response) {
      return response;

    })
    .catch(function (error) {
      if (error.response.data)
        toast.error(error.response.data)
      else
        toast.error(error)
    });
}
export const RegisterGoogle = async (data) => {
  return await axios.post(`${process.env.REACT_APP_API_URL}/api/users/registerGoogleUser`, data,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(function (response) {
      //console.log(response);
      return response;

    })
    .catch(function (error) {
      if (error.response.data)
        toast.error(error.response.data)
      else
        toast.error(error)
    });
}
export const LoginUserGoogle = async (data, navigate) => {
  return await axios.post(`${process.env.REACT_APP_API_URL}/api/users/loginGoogle`, data,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(function (response) {


      if (response.data) {
        const secretKey = process.env.REACT_APP_SECRET_KEY;
        const issuer = process.env.REACT_APP_ISSUER;

        try {

          const decodedToken = jwt.verify(response.data, secretKey, { issuer: issuer });


          const currentTime = Math.floor(Date.now / 100);
          if (decodedToken.exp && decodedToken.exp < currentTime) {
            throw new Error('Error: Expired token');
          }
          else {
            navigate("../home")
            localStorage.setItem('encodedToken', JSON.stringify(response.data));
            localStorage.setItem('token', JSON.stringify(decodedToken));
            localStorage.setItem('user', decodedToken.username);

            localStorage.setItem('googleuser', 'true');
            return response;
          }
        }
        catch (err) {
          console.log(err);
          toast.error('Error:expired od invalid token');
          throw new Error('Error:expired od invalid token');
        }
      }
      else {
        toast.error('invalid data!');
        return response;
      }
    })
    .catch(function (error) {
      if (error.response.data)
        toast.error(error.response.data)
      else
        toast.error(error)
    });

}
 */