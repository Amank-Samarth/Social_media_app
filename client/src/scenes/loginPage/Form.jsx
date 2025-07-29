import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  useMediaQuery,
  Typography,
  useTheme,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  EditOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";

const registerSchema = yup.object().shape({
  firstName: yup.string().required("required"),
  lastName: yup.string().required("required"),
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
  location: yup.string().required("required"),
  occupation: yup.string().required("required"),
  picture: yup.mixed(),
});

const loginSchema = yup.object().shape({
  email: yup.string().email("invalid email").required("required"),
  password: yup.string().required("required"),
});

const initialValuesRegister = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  location: "",
  occupation: "",
  picture: "",
};

const initialValuesLogin = {
  email: "",
  password: "",
};

const Form = () => {
  const [pageType, setPageType] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const isLogin = pageType === "login";
  const isRegister = pageType === "register";

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const register = async (values, onSubmitProps) => {
    try {
      // Log the values we're about to send
      console.log('Registration values:', values);
      
      // Create FormData for the request
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.entries(values).forEach(([key, value]) => {
        if (key !== 'picture' && value !== undefined) {
          formData.append(key, value);
        }
      });
      
      // Add profile picture if it exists
      if (values.picture) {
        console.log('Including picture in form data');
        formData.append("picture", values.picture);
      } else {
        console.log('No picture included in form data');
      }

      // Log form data entries for debugging
      console.log('FormData entries:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Make the registration request
      const response = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        body: formData, // Let the browser set the Content-Type with boundary
      });

      // Log the raw response for debugging
      const responseText = await response.text();
      console.log('Raw response:', responseText);
      
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        console.error('Failed to parse JSON response:', e);
        throw new Error('Invalid server response');
      }

      // Log the parsed response
      console.log('Parsed response:', responseData);

      if (!response.ok) {
        // Handle HTTP error responses
        const errorMessage = responseData.message || responseData.error || 'Registration failed';
        console.error('Registration failed:', response.status, errorMessage);
        throw new Error(errorMessage);
      }

      // Handle successful registration
      console.log('Registration successful:', responseData);
      onSubmitProps.resetForm();
      setPageType("login");
      alert('Registration successful! Please log in.');
      
    } catch (error) {
      console.error('Registration error:', error);
      alert(`Error: ${error.message || 'Registration failed. Please try again.'}`);
    }
  };

  const login = async (values, onSubmitProps) => {
    try {
      const loggedInResponse = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      // Log the full response for debugging
      console.log('Login Response:', {
        status: loggedInResponse.status,
        headers: Object.fromEntries(loggedInResponse.headers.entries())
      });

      const loggedIn = await loggedInResponse.json();
      
      // Extensive logging of login data
      console.log('Logged In Data:', {
        user: loggedIn.user ? {
          id: loggedIn.user._id,
          firstName: loggedIn.user.firstName,
          email: loggedIn.user.email
        } : 'No user data',
        token: loggedIn.token ? 'Token present' : 'No token'
      });

      onSubmitProps.resetForm();
      
      if (loggedIn && loggedIn.token) {
        // Store token in both localStorage and Redux
        localStorage.setItem('token', loggedIn.token);
        
        dispatch(
          setLogin({
            user: loggedIn.user,
            token: loggedIn.token,
          })
        );

        // Additional debugging: verify token storage
        console.log('Token stored:', {
          localStorageToken: localStorage.getItem('token'),
          reduxToken: window.store ? window.store.getState().token : 'No Redux store'
        });

        navigate("/home");
      } else {
        console.error('Login failed: No token received');
        alert('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert('An error occurred during login. Please try again.');
    }
  };

  const handleFormSubmit = async (values, onSubmitProps) => {
    if (isLogin) await login(values, onSubmitProps);
    if (isRegister) await register(values, onSubmitProps);
  };

  return (
    <Formik
      onSubmit={handleFormSubmit}
      initialValues={isLogin ? initialValuesLogin : initialValuesRegister}
      validationSchema={isLogin ? loginSchema : registerSchema}
    >
      {({
        values,
        errors,
        touched,
        handleBlur,
        handleChange,
        handleSubmit,
        setFieldValue,
        resetForm,
        isSubmitting,
      }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="20px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { 
                gridColumn: isNonMobile ? undefined : "span 4",
                transition: 'all 0.3s ease',
              },
            }}
          >
            {isRegister && (
              <>
                <TextField
                  label="First Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.firstName}
                  name="firstName"
                  variant="outlined"
                  size="small"
                  fullWidth
                  error={Boolean(touched.firstName) && Boolean(errors.firstName)}
                  helperText={touched.firstName && errors.firstName}
                  sx={{ 
                    gridColumn: "span 2",
                    '& .MuiInputLabel-root': {
                      color: 'text.secondary',
                      '&.Mui-focused': {
                        color: 'primary.main',
                      },
                    },
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'background.paper',
                      '& fieldset': {
                        borderColor: 'divider',
                        borderWidth: '1px',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                        borderWidth: '2px',
                      },
                    },
                    '& .MuiInputBase-input': {
                      color: 'text.primary',
                      fontSize: '0.95rem',
                      padding: '10px 14px',
                    },
                    '& .MuiFormHelperText-root': {
                      marginLeft: 0,
                      marginTop: '4px',
                      fontSize: '0.75rem',
                    },
                  }}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  label="Last Name"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.lastName}
                  name="lastName"
                  variant="outlined"
                  size="small"
                  error={Boolean(touched.lastName) && Boolean(errors.lastName)}
                  helperText={touched.lastName && errors.lastName}
                  sx={{ 
                    gridColumn: "span 2",
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'divider',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
                <TextField
                  label="Location"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.location}
                  name="location"
                  variant="outlined"
                  size="small"
                  error={Boolean(touched.location) && Boolean(errors.location)}
                  helperText={touched.location && errors.location}
                  sx={{ 
                    gridColumn: "span 4",
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'divider',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
                <TextField
                  label="Occupation"
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.occupation}
                  name="occupation"
                  variant="outlined"
                  size="small"
                  error={
                    Boolean(touched.occupation) && Boolean(errors.occupation)
                  }
                  helperText={touched.occupation && errors.occupation}
                  sx={{ 
                    gridColumn: "span 4",
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: 'divider',
                      },
                      '&:hover fieldset': {
                        borderColor: 'primary.main',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'primary.main',
                      },
                    },
                  }}
                />
                <Box
                  gridColumn="span 4"
                  border={`1px solid ${palette.secondary.light}`}
                  borderRadius="5px"
                  p="1rem"
                >
                  <Dropzone
                    acceptedFiles=".jpg,.jpeg,.png"
                    multiple={false}
                    onDrop={(acceptedFiles) =>
                      setFieldValue("picture", acceptedFiles[0])
                    }
                  >
                    {({ getRootProps, getInputProps }) => (
                      <Box
                        {...getRootProps()}
                        border={`2px dashed ${palette.primary.main}`}
                        p="1rem"
                        sx={{ "&:hover": { cursor: "pointer" } }}
                      >
                        <input {...getInputProps()} />
                        {!values.picture ? (
                          <p>Add Picture Here</p>
                        ) : (
                          <FlexBetween>
                            <Typography>{values.picture.name}</Typography>
                            <EditOutlined />
                          </FlexBetween>
                        )}
                      </Box>
                    )}
                  </Dropzone>
                </Box>
              </>
            )}

            <TextField
              label="Email"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.email}
              name="email"
              variant="outlined"
              size="small"
              fullWidth
              error={Boolean(touched.email) && Boolean(errors.email)}
              helperText={touched.email && errors.email}
              sx={{ 
                gridColumn: "span 4",
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                  '&.Mui-focused': {
                    color: 'primary.main',
                  },
                },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.paper',
                  '& fieldset': {
                    borderColor: 'divider',
                    borderWidth: '1px',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: '2px',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'text.primary',
                  fontSize: '0.95rem',
                  padding: '10px 14px',
                },
                '& .MuiFormHelperText-root': {
                  marginLeft: 0,
                  marginTop: '4px',
                  fontSize: '0.75rem',
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="Password"
              type={showPassword ? 'text' : 'password'}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.password}
              name="password"
              variant="outlined"
              size="small"
              fullWidth
              error={Boolean(touched.password) && Boolean(errors.password)}
              helperText={touched.password ? errors.password || ' ' : ' '}
              sx={{ 
                gridColumn: "span 4",
                '& .MuiInputLabel-root': {
                  color: 'text.secondary',
                  '&.Mui-focused': {
                    color: 'primary.main',
                  },
                },
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.paper',
                  '& fieldset': {
                    borderColor: 'divider',
                    borderWidth: '1px',
                  },
                  '&:hover fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: '2px',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputBase-input': {
                  color: 'text.primary',
                  fontSize: '0.95rem',
                  padding: '10px 14px',
                  fontFamily: showPassword ? 'inherit' : 'monospace',
                  letterSpacing: showPassword ? '0' : '0.1em',
                },
                '& .MuiFormHelperText-root': {
                  marginLeft: 0,
                  marginTop: '4px',
                  fontSize: '0.75rem',
                  minHeight: '20px',
                  visibility: touched.password || errors.password ? 'visible' : 'hidden',
                },
              }}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                      size="small"
                      sx={{ 
                        color: 'text.secondary',
                        '&:hover': {
                          color: 'primary.main',
                        },
                      }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          {/* BUTTONS */}
          <Box sx={{ mt: 3 }}>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                letterSpacing: '0.5px',
                background: `linear-gradient(135deg, ${palette.primary.main} 0%, ${palette.primary.dark} 100%)`,
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  boxShadow: '0 6px 10px rgba(0, 0, 0, 0.15)',
                  transform: 'translateY(-1px)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              {isSubmitting ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </Button>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography 
                variant="body2"
                component="span"
                sx={{ color: 'text.secondary' }}
              >
                {isLogin ? "Don't have an account? " : 'Already have an account? '}
              </Typography>
              <Typography
                component="span"
                onClick={() => {
                  setPageType(isLogin ? "register" : "login");
                  resetForm();
                }}
                sx={{
                  color: palette.primary.main,
                  fontWeight: 600,
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </Typography>
            </Box>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
