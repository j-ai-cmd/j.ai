import { Link } from "wouter";
import { Wordmark, EMAIL } from "@/components/shared";

export default function NotFound() {
  return (
    <div>
      <div className="h-mast">
        <div className="in">
          <Wordmark />
          <div className="nav">
            <Link href="/">Home</Link>
            <Link href="/donna">Legal</Link>
          </div>
        </div>
      </div>

      <section className="nf-body">
        <div className="wrap">
          <p className="nf-code">404</p>
          <h1>That page has moved, or never existed.</h1>
          <p className="nf-lede">
            Nothing lives at this address. The pages below are the ones worth your time.
          </p>
          <div className="nf-links">
            <Link href="/" className="btn btn-solid">Back to home</Link>
            <Link href="/donna" className="btn btn-line">See donna</Link>
          </div>
          <p className="nf-help">
            Looking for something specific? Email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
          </p>
        </div>
      </section>
    </div>
  );
}
