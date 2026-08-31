/**
 * Emits one JSON-LD block.
 *
 * The payload is serialized here rather than by the caller so the escaping is
 * in one place: `<` is escaped because a course title containing "</script>"
 * would otherwise close the tag and turn data into markup.
 */
export default function JsonLd({ data }: { data: object }) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(data).replace(/</g, '\u003c'),
            }}
        />
    );
}
