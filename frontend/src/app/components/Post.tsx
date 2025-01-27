import classes from './Post.module.css';


export default function Post(props: {author: string, body: string}) {
  return (
    <div className={classes.post}>
      <div className={classes.author}>Hello {props.author}</div>
      <div className={classes.text}>{props.body}</div>
    </div>
  )
}