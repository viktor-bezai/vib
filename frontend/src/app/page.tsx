"use client"
import {useState} from "react";
import Post from "@/app/components/Post";


export default function Home() {
  const names = ["Viktor", "Polina", "Maryna"];
  const [chosenName, setChosenName] = useState(
    Math.random() > 0.5 ? names[0] : names[1]
  );
  const [number, setNumber] = useState(1);

  const handleClick = () => {
    const randomIndex = Math.floor(Math.random() * names.length);
    setChosenName(names[randomIndex]);
  };

  const handleIncreaseNumber = () => {
    setNumber((prevNumber) => prevNumber + 1);
  };

  return (
    <div>
      <div>{number}</div>
      <div>Hello {chosenName}!</div>
      <a href="/awesome">Awesome</a>
      <div>
        <button onClick={handleClick}>Click</button>
      </div>
      <div>
        <button onClick={handleIncreaseNumber}>Increase Number</button>
      </div>
      <Post author={"Viktor"} body={"This is the Body from Viktor"}/>
      <Post author={"Polina"} body={"This is the Body from Polina"}/>
    </div>
  );
}
