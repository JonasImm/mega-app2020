import React, { useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchList } from "../api/list";
import styled from "@emotion/styled";
import { postProduct, fetchProductByname } from "../api/products";
import useAsync from "../hooks/useAsync";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import Header from "../components/Header";
import Menu from "../components/Menu";

function List() {
  const { id } = useParams();
  const [query, setQuery] = useState([]);
  const [display, setDisplay] = useState(false);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const node = useRef();

  const { data: list, loading, error, refetch } = useAsync(fetchList, id);
  useOnClickOutside(node, () => setOpen(false));

  async function handleClick(product) {
    console.log(product);
    setDisplay(!display);
    const data = {
      name: product.name,
      productId: product.id,
      category: product.category,
      listId: list.id,
    };
    await postProduct(data);
    await refetch();
    setQuery("");
  }
  async function handleSubmit(event) {
    event.preventDefault();
    const product = { name: query, listId: list.id };
    if (/\S/.test(product.name)) {
      await postProduct(product);
      await refetch();
      setQuery("");
    }
  }

  let timeOutId;
  function handleChange(input) {
    setQuery(input);
    clearTimeout(timeOutId);
    timeOutId = setTimeout(async () => {
      const result = await fetchProductByname(query);
      setProducts(result);
    }, 300);
  }

  return (
    <>
      {error && <div>Could not get data. Dont cry. Try again</div>}
      {loading && <div>Loading...</div>}
      {list && (
        <>
          <div ref={node}>
            <Header open={open} setOpen={setOpen} title={list.name}></Header>
            <Menu open={open} setOpen={setOpen} userName="Jonas Imm" />
          </div>
          <Container>
            <Form onSubmit={handleSubmit}>
              <label>Add your Products</label>
              <input
                placeholder="Search products"
                value={query}
                onClick={() => setDisplay(!display)}
                onChange={(event) => {
                  handleChange(event.target.value);
                }}
              />
              {display && (
                <div>
                  {products?.map((product) => (
                    <ProductName
                      key={product.id}
                      onClick={() => {
                        handleClick(product);
                      }}
                    >
                      {product.name}
                    </ProductName>
                  ))}
                </div>
              )}

              <button>Cancel</button>
              <input type="submit" value="Add product" />
            </Form>

            <ProductList>
              <h4>Product List</h4>
              {list.products.map((product) => (
                <div key={product.id}>
                  <p>{product.name}</p>
                  <span>Category: {product.category}</span>
                </div>
              ))}
            </ProductList>
          </Container>
        </>
      )}
    </>
  );
}

export default List;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  border: solid 1px;
  margin: 10px 0;
`;

const ProductList = styled.div`
  background-color: #f2f2f2;
  width: 150px;
  border: solid 1px;
  > h4 {
    text-align: center;
    text-decoration: underline;
  }
  p {
    margin: 10px 0 0 0;
    font-weight: bold;
  }
  span {
    font-size: 0.8rem;
  }
`;

const ProductName = styled.p`
  margin: 0;
  :hover {
    cursor: pointer;
    background-color: #f2f2f2;
  }
`;
