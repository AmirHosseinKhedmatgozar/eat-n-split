import { useState } from "react";
import "./App.css";
const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

function Button({ children, onclick }) {
  return (
    <button className="button" onClick={onclick}>
      {children}
    </button>
  );
}

export default function App() {
  const [showFriend, setShowFriend] = useState(false);
  const [friends, setFriends] = useState(initialFriends);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handlerSelected(friend) {
    setSelectedFriend((selected) =>
      selected?.id === friend.id ? null : friend
    );
    setShowFriend(false);
  }

  function clickShowButton() {
    setShowFriend((show) => !show);
  }

  function handleFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowFriend(false);
  }
  function handleSpliteBill(value) {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
    setSelectedFriend(null);
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onselect={handlerSelected}
          selectedFriend={selectedFriend}
        />
        {showFriend && <FormAddFriend onAddFriend={handleFriend} />}
        <Button onclick={clickShowButton}>
          {showFriend ? "Close" : "Add friend"}
        </Button>
      </div>
      {selectedFriend && (
        <FormSpliteBill
          key={selectedFriend.id}
          selectedFriend={selectedFriend}
          onSpliteBill={handleSpliteBill}
        />
      )}
    </div>
  );
}

function FormSpliteBill({ selectedFriend, onSpliteBill }) {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByfriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  function handleSubmit(e) {
    e.preventDefault();
    if (!bill && !!paidByUser) return;
    onSpliteBill(whoIsPaying === "user" ? paidByfriend : -paidByUser);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSubmit}>
      <h2>splite a bill with {selectedFriend.name} </h2>

      <label>💰Bill value</label>
      <input
        type="text"
        value={bill}
        onChange={(e) => setBill(Number(+e.target.value))}
      ></input>

      <label>🙎your expense</label>
      <input
        type="text"
        value={paidByUser}
        onChange={(e) =>
          setPaidByUser(
            Number(+e.target.value) > bill
              ? paidByUser
              : Number(+e.target.value)
          )
        }
      ></input>

      <label>🧑‍🤝‍🧑{selectedFriend.name}'s expense</label>
      <input type="text" disabled value={paidByfriend}></input>

      <label>💵Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button>Split bill </Button>
    </form>
  );
}
function FormAddFriend({ onAddFriend }) {
  const [name, setName] = useState("");
  const [Img, setImg] = useState("https://i.pravatar.cc/48");

  function handleSubmit(e) {
    e.preventDefault();
    const id = crypto.randomUUID();
    if (!name || !Img) return;
    const newFriend = {
      name,
      Img: `${Img}?=${id}`,
      balance: 0,
      id,
    };
    onAddFriend(newFriend);
    setName("");
    setImg("https://i.pravatar.cc/48");
  }

  return (
    <form className="form-add-friend" onSubmit={handleSubmit}>
      <label>🧑‍🤝‍🧑Friend Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      ></input>

      <label>🖼️ Img URL</label>
      <input
        type="text"
        value={Img}
        onChange={(e) => setImg(e.target.value)}
      ></input>

      <Button>Add</Button>
    </form>
  );
}

function FriendList({ friends, onselect, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          friend={friend}
          key={friend.id}
          onselect={onselect}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onselect, selectedFriend }) {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <li className={isSelected ? "selected" : ""}>
      <img src={friend.image} alt={friend.name}></img>
      <h3>{friend.name}</h3>
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you {friend.balance}${" "}
        </p>
      )}
      {friend.balance < 0 && (
        <p className="red">
          you owe {friend.name} {Math.abs(friend.balance)}$
        </p>
      )}
      {friend.balance === 0 && <p>you and {friend.name} are even</p>}
      <Button onclick={() => onselect(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}
