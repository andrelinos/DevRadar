import React, { useState } from 'react';
import api from '../../services/api';

import './styles.css';

function DevItem({ dev }) {
  const [edit, setEdit] = useState(false);

  const [github_username, setGithubusername] = useState('');
  const [techs, setTechs] = useState('');

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  async function handleDeleteDev() {
    if (window.confirm(`Are you sure delete this dev ${dev.name}?`)) {
      try {
        await api.delete(`/devs/${dev._id}`);
        window.location.reload();
      } catch {
        return alert('An error occurred while trying to remove the developer.');
      }
    }
  }

  function handleOpenEdit() {
    setEdit(true);
  }

  function handleCloseEdit() {
    setEdit(false);
  }

  async function handleEditDev() {
    try {
      await api.put(`/devs/${dev._id}`, {
        github_username,
        techs,
        latitude,
        longitude,
      });
      alert(`The developer ${dev.github_username} was updated success.`);
    } catch {
      alert('Try later again.');
    }
  }
  return edit ? (
    <li className="dev-item">
      <form onSubmit={handleEditDev}>
        <header>
          <div className="info">
            <img src={dev.avatar_url} alt={dev.name} />
          </div>

          <div className="settings">
            <button type="submit">Salvar</button>

            <button type="submit" onClick={handleCloseEdit}>
              Cancelar
            </button>
          </div>
        </header>

        <div className="user-edit">
          <label htmlFor="name">Github Username</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder={dev.github_username}
            value={github_username}
            onChange={e => setGithubusername(e.target.value)}
            required
          />

          <label htmlFor="techs">Techs</label>
          <input
            type="text"
            name="techs"
            id="techs"
            placeholder={dev.techs}
            value={techs}
            onChange={e => setTechs(e.target.value)}
            required
          />

          <label htmlFor="latitude">Latitude</label>
          <input
            type="number"
            name="latitude"
            id="latitude"
            placeholder={dev.location.coordinates[1]}
            value={latitude}
            onChange={e => setLatitude(e.target.value)}
            required
          />

          <label htmlFor="longitude">Longitude</label>
          <input
            type="number"
            name="longitude"
            id="longitude"
            placeholder={dev.location.coordinates[0]}
            value={longitude}
            onChange={e => setLongitude(e.target.value)}
            required
          />
        </div>
      </form>
    </li>
  ) : (
    <li className="dev-item">
      <header>
        <div className="info">
          <img src={dev.avatar_url} alt={dev.github_username} />
          <div className="user-info">
            <strong
              className="nomeGithub"
              title={'Clique para copiar Github Username'}
            >
              {dev.name}
            </strong>
            <span>
              {!dev.techs ? (dev.techs = ['-']) : dev.techs.join(', ')}
            </span>
          </div>
        </div>

        <div className="setings">
          <button
            type="button"
            className="edit"
            onClick={handleOpenEdit}
          ></button>

          <button
            type="button"
            className="delete"
            onClick={handleDeleteDev}
          ></button>
        </div>
      </header>

      <p>{dev.bio}</p>
      <a
        href={`http://github.com/${dev.github_username}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        Acessar perfil no Github
      </a>
    </li>
  );
}

export default DevItem;
