import Link from "next/link";
import { useRouter } from "next/router";

function CustomLink(props) {
  const router = useRouter();

  function handleClick(event) {
    event.preventDefault();
    const newUrl = props.as || props.href;
    const currentUrl = window.location.pathname + window.location.search;
    if (newUrl !== currentUrl) {
      window.history.replaceState(null, "", newUrl+"/");
      router.push(props.href, props.as);
    }
  }

  return (
    <Link {...props} passHref>
      <a onClick={handleClick}>{props.children}</a>
    </Link>
  );
}

export default CustomLink;
