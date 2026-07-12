import { GeomorphGenerator } from "./GeomorphGenerator";
import { GeomorphNav } from "./geomorph-shared/GeomorphNav";

export default function RefactorGeomorphPage() {
  return (
    <main>
      <div style={{ padding: 16 }}>
        <GeomorphNav />
      </div>
      <GeomorphGenerator name='map' />
    </main>
  )
}
