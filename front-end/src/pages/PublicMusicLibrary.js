import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import backgroundImage from "../images/bluebackground.png";
import LogoutNavbar from "../navibars/LogoutNavbar";
import StaffNavbar from "../navibars/StaffNavbar";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";
import "../components/customCss.css";
import backButtonIcon from "../images/back-button-icon.png";

function PublicMusicLibrary() {
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "100vh",
  };

  // Existing states
  const [songs, setSongs] = useState([]);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const { username } = useParams();
  const localUserRole = localStorage.getItem("userRole");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const playlistName = localStorage.getItem("playlistName");
  console.log(playlistName);
  console.log(username);
  const [searchTerm, setSearchTerm] = useState("");

  // New state for the confirmation modal
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const songsPerPage = 6;
  const indexOfLastSong = currentPage * songsPerPage;
  const indexOfFirstSong = indexOfLastSong - songsPerPage;

  const filteredSongs = songs.filter((song) => {
    const searchsong = `${song.musicName}`.toLowerCase();
    return searchsong.includes(searchTerm.toLowerCase());
  });

  const totalPages = Math.ceil(filteredSongs.length / songsPerPage);
  const currentSongs = filteredSongs.slice(indexOfFirstSong, indexOfLastSong);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  useEffect(() => {
    axios
      .get(process.env.REACT_APP_BACKEND_URL+"music/")
      .then((response) => {
        if (response.data && response.data.data) {
          setSongs(response.data.data);
        } else {
          setError(true);
        }
      })
      .catch((error) => {
        console.error("Failed to fetch songs from the backend", error);
        setError(true);
      });
    return () => {
      // Cleanup (if needed)
    };
  }, [playlistName, username]);

  const toggleSongSelection = (musicID) => {
    if (selectedSongs.includes(musicID)) {
      setSelectedSongs((prevSongs) => prevSongs.filter((id) => id !== musicID));
    } else {
      setSelectedSongs((prevSongs) => [...prevSongs, musicID]);
    }
  };
  const addToPlaylist = async () => {
    try {
      const { data } = await axios.patch(process.env.REACT_APP_BACKEND_URL+"musiclist/", {
        username: username,
      });

      const userPlaylist = data.data.find(
        (list) => list.musicListName === playlistName.replace("_", " ")
      );

      if (!userPlaylist) {
        throw new Error("User playlist not found");
      }
      const existingSongIds = userPlaylist.musicIn;
      const songsToAdd = selectedSongs.filter(
        (songId) => !existingSongIds.includes(songId)
      );
      if (songsToAdd.length === 0) {
        alert("All selected songs are already in the playlist.");
        return;
      }
      if (songsToAdd.length < selectedSongs.length) {
        const existingSongs = selectedSongs
          .filter((songId) => existingSongIds.includes(songId))
          .map((songId) => {
            const song = songs.find((s) => s.musicID === songId);
            return song.musicName;
          });
        alert(
          `The following songs are already in the playlist: ${existingSongs.join(
            ", "
          )}`
        );
      }

      // add new song
      const musicListID = userPlaylist.musicListId;
      const promises = songsToAdd.map((musicID) =>
        axios.post(process.env.REACT_APP_BACKEND_URL+"musiclist/", {
          MusicID: musicID,
          MusicListID: musicListID,
        })
      );

      const responses = await Promise.all(promises);
      for (const response of responses) {
        if (!response.data || response.status !== 200) {
          throw new Error("Failed to add a song to playlist");
        }
      }

      alert("Songs added to playlist successfully!");
      setSelectedSongs([]);
      navigate(`/MusicListHome/${username}/${playlistName}`);
    } catch (error) {
      console.error("Failed to add songs to playlist:", error);
      setErrorMessage("There was an error adding songs to the playlist.");
      setShowErrorModal(true);
    }
  };

  const checkExistingSongs = (
    selectedSongs,
    existingSongs,
    userPlaylistSongs
  ) => {
    const alreadyExisting = [];
    const newSongs = [];

    selectedSongs.forEach((songId) => {
      if (userPlaylistSongs.includes(songId)) {
        const song = existingSongs.find((s) => s.musicID === songId);
        if (song) {
          alreadyExisting.push(song);
        }
      } else {
        newSongs.push(songId);
      }
    });

    return [alreadyExisting, newSongs];
  };

  const buttonStyle = {
    padding: "10px 20px",
    margin: "0 10px",
    backgroundColor: "#2c82cd",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  };

  const positioningStyle = {
    position: "absolute",
    top: "6rem",
    right: "7vw",
    fontSize: "1.25rem",
  };

  return (
    <div style={backgroundStyle}>
      {localUserRole === "staff" ? <StaffNavbar /> : <LogoutNavbar />}

      <div
        className="d-flex flex-column justify-content-center align-items-center"
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "10px",
          marginTop: "15px",
        }}
      >
        <span
          className="d-flex align-items-center"
          style={{ marginRight: "8px" }}
        >
          This is Public Music Library.
        </span>
      </div>
      <Link
        to={`/MusicListHome/${username}/${playlistName}`}
        style={{
          position: "absolute",
          top: "80px",
          left: "20px",
          textDecoration: "none",
        }}
      >
        <img
          src={backButtonIcon}
          alt="Back to Music List Home"
          style={{ width: "30px", height: "30px" }}
        />
      </Link>
      <Form
        onSubmit={handleSearch}
        className="mb-3"
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        <Form.Group controlId="searchTerm">
          <Form.Label>Please enter the song name to search</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter search song name here"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>
      </Form>
      {error && (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ color: "red", marginBottom: "10px" }}
        >
          <h4>
            Loading public music library unsuccessfully, please try again later.
          </h4>
        </div>
      )}
      {/* Render Songs */}
      <div className="d-flex justify-content-center align-items-center flex-column">
        {currentSongs.map((song) => {
          return (
            <div
              key={song.musicID}
              style={{
                borderRadius: "10px",
                backgroundColor: "white",
                padding: "20px",
                width: "1200px",
                margin: "10px 0",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginRight: "50px",
                  }}
                >
                  {song.musicName}
                </span>
                <span>{song.musicAuthor}</span>
              </div>
              <input
                type="checkbox"
                checked={selectedSongs.includes(song.musicID)}
                onChange={() => toggleSongSelection(song.musicID)}
                style={{
                  width: "25px",
                  height: "25px",
                  marginRight: "10px",
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Pagination Logic */}
      <div
        className="pagination-controls"
        style={{
          bottom: "50px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          style={buttonStyle}
        >
          Previous
        </button>
        <span style={{ margin: "0 10px" }}>
          {currentPage} of {totalPages}
        </span>
        <button
          onClick={nextPage}
          disabled={currentPage === totalPages}
          style={buttonStyle}
        >
          Next
        </button>
      </div>

      <button
        onClick={() => setShowConfirmationModal(true)}
        className="custom-button2"
        style={positioningStyle}
      >
        Add Selected to Playlist
      </button>

      {/* Confirmation Modal */}
      <Modal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div>Following songs will be added to the playlist:</div>
          <ul>
            {selectedSongs.map((songId) => {
              const song = songs.find((s) => s.musicID === songId);
              return (
                <li key={songId}>
                  {song?.musicName} - {song?.musicAuthor}
                </li>
              );
            })}
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmationModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            style={{ backgroundColor: "#2c82cd", borderColor: "#2c82cd" }}
            onClick={addToPlaylist}
          >
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Error Modal */}
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>{errorMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default PublicMusicLibrary;
