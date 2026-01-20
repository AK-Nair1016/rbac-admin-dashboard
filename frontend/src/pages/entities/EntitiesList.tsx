import { useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import { getAllEntities, getMyEntities } from "../../api/entities";
import type { Entity } from "../../api/entities";

const EntitiesList = () => {
  const { user } = useAuth();

  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user)return;

    const fetchEntities = async () => {
      try {
        setLoading(true);

        const response =
          user.role === "user"
            ? await getMyEntities()
            : await getAllEntities();

        setEntities(response.data);
      } catch {
        setError("Failed to load entities");
      } finally {
        setLoading(false);
      }
    };

    fetchEntities();
  }, [user]);

  if (loading) return <p>Loading entities...</p>;
  if (error) return <p>{error}</p>;
  if (entities.length === 0) return <p>No entities found</p>;
  
  if (!user)return null;


  return (
    <div>
      <h1>Entities</h1>

      <ul>
        {entities.map((entity) => {
          const canEdit =
            user.role === "admin" ||
            user.role === "manager" ||
            (user.role === "user" &&
              entity.ownerId === user.employeeId);

          return (
            <li key={entity.id}>
              <strong>{entity.name}</strong>
              <p>{entity.description}</p>

              {canEdit && <button>Edit</button>}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default EntitiesList;
