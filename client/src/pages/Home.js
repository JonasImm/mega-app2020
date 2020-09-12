import React, { useRef, useState } from "react";
import styled from "@emotion/styled";
import { fetchLists, postList } from "../api/list";
import useAsync from "../hooks/useAsync";
import List from "../components/List";
import ListItem from "../components/ListItem";
import Header from "../components/Header";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import Menu from "../components/Menu";

function Home() {
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const node = useRef();
  const { data: lists, loading, error, refetch } = useAsync(fetchLists);
  useOnClickOutside(node, () => setOpen(false));

  async function handleSubmit(event) {
    event.preventDefault();
    const data = { name };
    await postList(data);
    await refetch();
    hideForm();
    setName("");
  }

  function displayForm() {
    document.querySelector(".createList").style.display = "flex";
  }
  function hideForm() {
    document.querySelector(".createList").style.display = "none";
  }

  return (
    <>
      <div ref={node}>
        <Header open={open} setOpen={setOpen} title="Grocery Lists"></Header>
        <Menu open={open} setOpen={setOpen} userName="Jonas Imm" />
      </div>
      <Container>
        <form className="createList" onSubmit={handleSubmit}>
          <label>Create new shopping list</label>
          <input
            value={name}
            placeholder="Enter shopping list name"
            onChange={(event) => setName(event.target.value)}
          />

          <button onClick={() => hideForm()}>Cancel</button>
          <input type="submit" disabled={!name} value="Create list" />
        </form>
        <button onClick={() => displayForm()}>Add List</button>
        <List>
          {error && <div>Could not get data. Please cry.</div>}
          {loading && <div>Loading...</div>}
          {lists?.map((list) => (
            <ListItem key={list.id} list={list} href={`/home/${list.id}`} />
          ))}
        </List>
      </Container>
    </>
  );
}

export default Home;
const Container = styled.div`
  background-color: #f2f2f2;
  width: 100vw;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-direction: column;
  overflow: hidden;
  > p {
    margin: 0;
  }
  > form {
    display: none;
    flex-direction: column;
    position: fixed;
    border: solid 2px;
  }
`;
