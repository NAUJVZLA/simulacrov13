"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Edit, Trash } from "lucide-react";
import { InterfacePost } from "../controller/interface";
import { Users } from "../controller/interface";
import {
  post as POSTS_ENDPOINT,
  users as USERS_ENDPOINT,
} from "../controller/api";
const PostsHome: React.FC = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<InterfacePost[]>([]);
  const [users, setUsers] = useState<Record<number, Users>>({});
  const [newPost, setNewPost] = useState({ title: "", description: "" });
  const [showPosts, setShowPosts] = useState(false);
  const [editPost, setEditPost] = useState<InterfacePost | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (!token) {
      router.push("./login");
    } else {
      fetchUsers(token);
    }
  }, [router]);

  const fetchPosts = async (token: string) => {
    try {
      const response = await fetch(POSTS_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) {
        router.push("/login");
      }
      if (!response.ok) {
        throw new Error("Error al obtener los posts.");
      }
      const data = await response.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error("Error al obtener los posts:", error);
      alert("Error al obtener los posts.");
    }
  };

  const fetchUsers = async (token: string) => {
    try {
      const response = await fetch(USERS_ENDPOINT, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) {
        router.push("/login");
      }
      if (!response.ok) {
        throw new Error("Error al obtener los usuarios.");
      }
      const data = await response.json();
      const userMap = data.reduce((acc: Record<number, Users>, user: Users) => {
        acc[user.id] = user;
        return acc;
      }, {});
      setUsers(userMap);
    } catch (error) {
      console.error("Error al obtener los usuarios:", error);
      alert("Error al obtener los usuarios.");
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = sessionStorage.getItem("token");
      const userId = parseInt(sessionStorage.getItem("id") || "0");
      const response = await fetch(POSTS_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...newPost, user_id: userId }),
      });
      if (response.status === 401) {
        router.push("/login");
      }
      if (!response.ok) {
        throw new Error("Error al crear el post.");
      }
      setNewPost({ title: "", description: "" });
      fetchPosts(token || "");
      alert("Post creado con éxito!");
    } catch (error) {
      console.error("Error al crear el post:", error);
      alert("Error al crear el post.");
    }
  };

  const handleEdit = (post: InterfacePost) => {
    setEditPost(post);
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editPost) {
      try {
        const token = sessionStorage.getItem("token");
        const response = await fetch(`${POSTS_ENDPOINT}/${editPost.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editPost),
        });
        if (response.status === 401) {
          router.push("/login");
        }
        if (!response.ok) {
          throw new Error("Error al actualizar el post.");
        }
        setEditPost(null);
        fetchPosts(token || "");
        alert("Post actualizado con éxito!");
      } catch (error) {
        console.error("Error al actualizar el post:", error);
        alert("Error al actualizar el post.");
      }
    }
  };

  const handleDelete = async (postId: number) => {
    try {
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${POSTS_ENDPOINT}/${postId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 401) {
        router.push("/login");
      }
      if (!response.ok) {
        throw new Error("Error al eliminar el post.");
      }
      fetchPosts(token || "");
      alert("Post eliminado con éxito!");
    } catch (error) {
      console.error("Error al eliminar el post:", error);
      alert("Error al eliminar el post.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("name");
    sessionStorage.removeItem("id");
    router.push("/login");
  };

  const handleShowPosts = () => {
    setShowPosts(true);
    const token = sessionStorage.getItem("token");
    if (token) {
      fetchPosts(token);
    }
  };

  return (
    <div className="container">
      <div className="formWrapper">
        <h1 className="pageTitle">
          Hola, Bienvenido {sessionStorage.getItem("name")}
        </h1>
        <button className="button" onClick={handleLogout}>
          Cerrar Sesión
        </button>

        <form className="form" onSubmit={handleCreatePost}>
          <input
            className="formInput"
            type="text"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
            placeholder="Título"
            required
          />
          <textarea
            className="formTextarea"
            value={newPost.description}
            onChange={(e) =>
              setNewPost({ ...newPost, description: e.target.value })
            }
            placeholder="Descripción"
            required
          />
          <button className="formButton" type="submit">
            Crear post
          </button>
        </form>

        {editPost && (
          <form className="form" onSubmit={handleUpdatePost}>
            <input
              className="formInput"
              type="text"
              value={editPost.title}
              onChange={(e) =>
                setEditPost({ ...editPost, title: e.target.value })
              }
              placeholder="Títuloo"
              required
            />
            <textarea
              className="formTextarea"
              value={editPost.description}
              onChange={(e) =>
                setEditPost({ ...editPost, description: e.target.value })
              }
              placeholder="Descripción"
              required
            />
            <button className="formButton" type="submit">
              Actualizar post
            </button>
          </form>
        )}

        <button className="button" onClick={handleShowPosts}>
          Mostrar Todos los Posts
        </button>

        {showPosts && (
          <div className="postsContainer">
            {posts.length > 0 ? (
              posts.map((post) => (
                <div key={post.id} className="card">
                  <h2 className="cardTitle">{post.title}</h2>
                  <p className="cardDescription">{post.description}</p>
                  <p className="cardAuthor">
                    Publicado por: {users[post.user_id]?.name || "Cargando..."}
                  </p>
                  <div className="actions">
                    <button
                      className="actionButton"
                      onClick={() => handleEdit(post)}
                    >
                      <Edit /> Editar
                    </button>
                    <button
                      className="actionButton"
                      onClick={() => handleDelete(post.id)}
                    >
                      <Trash /> Borrar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No hay posts disponibles</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsHome;
