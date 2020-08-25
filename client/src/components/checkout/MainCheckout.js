import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

import "./MainCheckout.css";

import { AuthContext } from "../../context/AuthContext";

function MainCheckout() {
  const { register, handleSubmit, errors } = useForm();
  const [errorMessage, setErrorMessage] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState();
  const { auth, token, userId } = useContext(AuthContext);
  const [userIdValue, setUserIdValue] = userId;
  const [tokenValue, setTokenValue] = token;

  const history = useHistory();

  useEffect(() => {
    axios
      .post(
        "/items/cartitems",
        { userId: userIdValue },
        {
          headers: {
            Authorization: "Bearer " + tokenValue,
          },
        }
      )
      .then((res) => {
        let total = 0;
        res.data.foundCartItems.forEach((item) => {
          total =
            total + parseFloat(item.price.slice(0, -1)) * item.q[item._id];
        });
        setTotalPrice(total.toFixed(2));
        setCartItems(res.data.foundCartItems);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onSubmit = (data, event) => {
    event.preventDefault();

    axios
      .post(
        "/items/order",
        {
          products: {
            products: cartItems,
            totalPrice: totalPrice,
          },
          user: {
            information: {
              firstname: data.firstname,
              lastname: data.lastname,
              address: data.address,
              postalcode: data.postalcode,
              city: data.city,
            },
            userId: userIdValue,
          },
        },
        {
          headers: {
            Authorization: "Bearer " + tokenValue,
          },
        }
      )
      .then((res) => {
        history.push("/profile");
      })
      .catch((err) => {
        console.log(err);
        setErrorMessage("Invalid input.");
      });
  };

  return (
    <div className="CheckoutContainer">
      <div className="CheckoutFormWrapper">
        <div className="CheckoutForm">
          <form onSubmit={handleSubmit(onSubmit)}>
            {errors.firstname && (
              <p className="CheckoutText" style={{ color: "red" }}>
                Firstname is invalid
              </p>
            )}
            {errors.lastname && (
              <p className="CheckoutText" style={{ color: "red" }}>
                Lastname is invalid
              </p>
            )}
            {errors.address && (
              <p className="CheckoutText" style={{ color: "red" }}>
                Address is invalid
              </p>
            )}
            {errors.postalcode && (
              <p className="CheckoutText" style={{ color: "red" }}>
                Postal code is invalid
              </p>
            )}
            {errors.city && (
              <p className="CheckoutText" style={{ color: "red" }}>
                City is invalid
              </p>
            )}
            <p className="LoginText" style={{ color: "red" }}>
              {errorMessage}
            </p>
            <div className="CheckoutHeading">Invictus Store</div>
            <p className="CheckoutText">Shipping address:</p>
            <input
              type="text"
              placeholder="First name"
              name="firstname"
              ref={register({ required: true, minLength: 2, maxLength: 35 })}
            />
            <input
              type="text"
              placeholder="Last name"
              name="lastname"
              ref={register({ required: true, minLength: 2, maxLength: 35 })}
            />
            <input
              type="text"
              placeholder="Address"
              name="address"
              ref={register({ required: true, minLength: 5, maxLength: 35 })}
            />
            <input
              type="number"
              placeholder="Postal code"
              name="postalcode"
              ref={register({ required: true, minLength: 5, maxLength: 5 })}
            />
            <input
              type="text"
              placeholder="City"
              name="city"
              ref={register({ required: true, minLength: 2, maxLength: 35 })}
            />
            <button type="submit" className="btn effect01" target="_blank">
              <span>ORDER NOW</span>
            </button>
          </form>
          <br />
          <div className="CheckoutText">
            Want to make some changes?{" "}
            <Link to="/cart" style={{ color: "inherit" }}>
              Return to cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainCheckout;
