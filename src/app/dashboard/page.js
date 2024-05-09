"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { baseUrl } from "../baseUrl";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
  const [data, setData] = useState([]);
  const [checkedIds, setCheckedIds] = useState([]);
  const router = useRouter();

  const [parseToken, setParseToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const parsedToken = JSON.parse(token);
    setParseToken(parsedToken);
  }, []);

  const fetchProducts = () => {
    axios
      .get(`${baseUrl}/api/v1/products/find-products`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${parseToken}`,
        },
      })
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = () => {
    axios
      .delete(`${baseUrl}/api/v1/products/remove`, {
        data: { productIds: checkedIds },
        withCredentials: true,
      })
      .then((res) => {
        console.log(res);
        fetchProducts();
        setCheckedIds([]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    console.log("rendering");
    setTimeout(fetchProducts, 2000);
  }, []);

  const logoutUser = () => {
    console.log(parseToken);
    axios
      .post(`${baseUrl}/api/v1/users/auth-user-logout`, null, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${parseToken}`,
        },
      })
      .then((res) => {
      
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        alert("logout");
        router.push("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCheckboxChange = (id) => {
    if (checkedIds.includes(id)) {
      setCheckedIds(checkedIds.filter((checkedId) => checkedId !== id));
    } else {
      setCheckedIds([...checkedIds, id]);
    }
  };

  const [itemEdit, setItemEdit] = useState(false);
  const [itemEditData, setItemEditData] = useState({});
  const [editedData, setEditedData] = useState({});

  const handleEditData = () => {
    axios
      .patch(
        `${baseUrl}/api/v1/products/edit-product/${itemEditData?._id}`,
        editedData,
        { withCredentials: true }
      )
      .then((res) => {
        console.log(res);
        setItemEdit(!itemEdit);
        setEditedData({});
        fetchProducts();
        alert(res.data.message);
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.message);
      });
  };

  const handleEdit = (item) => {
    setItemEdit(true);
    setItemEditData(item);
  };
  console.log(editedData);

  const handleInputChange = (e, key) => {
    setEditedData({
      ...editedData,
      [key]: e.target.value,
    });
  };
  return (
    <div className="min-h-screen w-full">
      <h1>Dashboard page</h1>
      <button onClick={logoutUser}>Logout</button>
      {checkedIds?.length > 0 && (
        <button onClick={handleDelete} className="bg-yellow-500">
          Delete selected: {checkedIds?.length}
        </button>
      )}
      <p>Total data: {data?.length}</p>
      {itemEdit && (
        <div className="m-2">
          <button
            onClick={(e) => {
              setItemEdit(!itemEdit);
              setEditedData({});
            }}
            className="bg-red-600 p-2 text-white"
          >
            Close
          </button>
          <br />
          <br />
          <div className="flex gap-10">
            <div>
              shop_id: (not editable)
              <br />
              <input
                type="text"
                name=""
                id=""
                value={itemEditData?.shop_id}
                readOnly
              />
              <br />
              product_id: (not editable)
              <br />
              <input
                type="text"
                name=""
                id=""
                value={itemEditData?.product_id}
                readOnly
              />
              <br />
              product_name:
              <br />
              <input
                type="text"
                name=""
                id=""
                value={editedData.product_name || itemEditData?.product_name}
                onChange={(e) => handleInputChange(e, "product_name")}
              />
              <br />
              group_name:
              <br />
              <input
                type="text"
                name=""
                id=""
                value={editedData.group_name || itemEditData?.group_name}
                onChange={(e) => handleInputChange(e, "group_name")}
              />
              <br />
              supplier:
              <br />
              <input
                type="text"
                name=""
                id=""
                value={editedData.supplier || itemEditData?.supplier}
                onChange={(e) => handleInputChange(e, "supplier")}
              />
              <br />
              category:
              <br />
              <input
                type="text"
                name=""
                id=""
                value={editedData.category || itemEditData?.category}
                onChange={(e) => handleInputChange(e, "category")}
              />
              <br />
            </div>
            <div>
              weight_or_size:
              <br />
              <input
                type="text"
                name=""
                id=""
                value={
                  editedData.weight_or_size || itemEditData?.weight_or_size
                }
                onChange={(e) => handleInputChange(e, "weight_or_size")}
              />
              <br />
              product_type:
              <br />
              <input
                type="text"
                name=""
                id=""
                value={editedData.product_type || itemEditData?.product_type}
                onChange={(e) => handleInputChange(e, "product_type")}
              />
              <br />
              purchase_price:
              <br />
              <input
                type="text"
                name=""
                id=""
                value={
                  editedData.purchase_price || itemEditData?.purchase_price
                }
                onChange={(e) => handleInputChange(e, "purchase_price")}
              />
              <br />
              sell_price:
              <br />
              <input
                type="text"
                name=""
                id=""
                value={editedData.sell_price || itemEditData?.sell_price}
                onChange={(e) => handleInputChange(e, "sell_price")}
              />
              <br />
              stock_left:
              <br />
              <input
                type="text"
                name=""
                id=""
                value={editedData.stock_left || itemEditData?.stock_left}
                onChange={(e) => handleInputChange(e, "stock_left")}
              />
              <br />
            </div>
          </div>
          <button
            onClick={handleEditData}
            className="bg-blue-600 w-full text-white"
          >
            Submit
          </button>
        </div>
      )}
      <div className="grid grid-cols-3">
        {data?.map((d, i) => {
          return (
            <ul key={d?._id} className="border border-red-600 m-4 p-2">
              <input
                className="h-5 w-5 cursor-pointer"
                type="checkbox"
                onChange={() => handleCheckboxChange(d.product_id)}
              />
              <br />
              <button
                onClick={() => handleEdit(d)}
                className="bg-blue-600 text-white px-2"
              >
                Edit
              </button>
              <p>serial: {i + 1}</p>
              <li>
                product_id:{" "}
                <span className="text-green-600">{d?.product_id}</span>
              </li>
              <li>
                shop_id: <span className="text-green-600">{d?.shop_id}</span>
              </li>
              <li>
                product_title:{" "}
                <span className="text-green-600">{d?.product_title}</span>
              </li>
              <li>
                product_title_slug:{" "}
                <span className="text-green-600">{d?.product_title_slug}</span>
              </li>
              <li>
                product_name:{" "}
                <span className="text-green-600">{d?.product_name}</span>
              </li>
              <li>
                group_name:{" "}
                <span className="text-green-600">{d?.group_name}</span>
              </li>
              <li>
                supplier: <span className="text-green-600">{d?.supplier}</span>
              </li>
              <li>
                category: <span className="text-green-600">{d?.category}</span>
              </li>
              <li>
                weight_or_size:{" "}
                <span className="text-green-600">{d?.weight_or_size}</span>
              </li>
              <li>
                product_type:{" "}
                <span className="text-green-600">{d?.product_type}</span>
              </li>
              <li>
                discount_option:{" "}
                <span className="text-green-600">
                  {d?.discount_option ? "true" : "false"}
                </span>
              </li>
              <li>
                purchase_price:{" "}
                <span className="text-green-600">{d?.purchase_price}</span>
              </li>
              <li>
                sell_price:{" "}
                <span className="text-green-600">{d?.sell_price}</span>
              </li>
              <li>
                stock_left:{" "}
                <span className="text-green-600">{d?.stock_left}</span>
              </li>
              <li>
                lifetime_supply:{" "}
                <span className="text-green-600">{d?.lifetime_supply}</span>
              </li>
              <li>
                lifetime_sells:{" "}
                <span className="text-green-600">{d?.lifetime_sells}</span>
              </li>
              <li>
                createdAt:{" "}
                <span className="text-green-600">{d?.createdAt}</span>
              </li>
              <li>
                createdBy:{" "}
                <span className="text-green-600">{d?.createdBy}</span>
              </li>
              <li>
                updatedAt:{" "}
                <span className="text-green-600">{d?.updatedAt}</span>
              </li>
              <li>
                updatedBy:{" "}
                <span className="text-green-600">{d?.updatedBy}</span>
              </li>
            </ul>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardPage;
