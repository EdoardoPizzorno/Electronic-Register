-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Mag 07, 2023 alle 23:41
-- Versione del server: 10.4.27-MariaDB
-- Versione PHP: 8.1.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `registroElettronico`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `classi`
--

CREATE TABLE `classi` (
  `id` int(11) NOT NULL,
  `nome` varchar(6) NOT NULL,
  `materie` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `classi`
--

INSERT INTO `classi` (`id`, `nome`, `materie`) VALUES
(1, '1A INF', '[1, 2, 3, 4, 5, 6, 11, 12, 13, 14]'),
(2, '1B INF', '[1, 2, 3, 4, 5, 6, 11, 12, 13, 14]'),
(3, '1C INF', '[1, 2, 3, 4, 5, 6, 11, 12, 13, 14]'),
(4, '1D INF', '[1, 2, 3, 4, 5, 6, 11, 12, 13, 14]'),
(5, '1E INF', '[1, 2, 3, 4, 5, 6, 11, 12, 13, 14]'),
(6, '2A INF', '[1, 2, 3, 4, 5, 6, 11, 12, 13, 14]'),
(7, '2B INF', '[1, 2, 3, 4, 5, 6, 11, 12, 13, 14]'),
(8, '2C INF', '[1, 2, 3, 4, 5, 6, 11, 12, 13, 14]'),
(9, '2D INF', '[1, 2, 3, 4, 5, 6, 11, 12, 13, 14]'),
(10, '2E INF', '[1, 2, 3, 4, 5, 6, 11, 12, 13, 14]'),
(11, '3A INF', '[1, 2, 3, 4, 5, 6, 21, 22, 23, 24]'),
(12, '3B INF', '[1, 2, 3, 4, 5, 6, 21, 22, 23, 24]'),
(13, '3D INF', '[1, 2, 3, 4, 5, 6, 21, 22, 23, 24]'),
(14, '3C INF', '[1, 2, 3, 4, 5, 6, 21, 22, 23, 24]'),
(15, '3E INF', '[1, 2, 3, 4, 5, 6, 21, 22, 23, 24]'),
(16, '4A INF', '[1, 2, 3, 4, 5, 6, 21, 22, 23, 24]'),
(17, '4B INF', '[1, 2, 3, 4, 5, 6, 21, 22, 23, 24]'),
(18, '4C INF', '[1, 2, 3, 4, 5, 6, 21, 22, 23, 24]'),
(19, '4D INF', '[1, 2, 3, 4, 5, 6, 21, 22, 23, 24]'),
(20, '4E INF', '[1, 2, 3, 4, 5, 6, 21, 22, 23, 24]'),
(21, '5A INF', '[1, 2, 3, 4, 5, 6, 21, 22, 23, 25]'),
(22, '5B INF', '[1, 2, 3, 4, 5, 6, 21, 22, 23, 25]'),
(23, '5C INF', '[1, 2, 3, 4, 5, 6, 21, 22, 23, 25]'),
(24, '5D INF', '[1, 2, 3, 4, 5, 6, 21, 22, 23, 25]'),
(25, '5E INF', '[1, 2, 3, 4, 5, 6, 21, 22, 23, 25]');

-- --------------------------------------------------------

--
-- Struttura della tabella `materie`
--

CREATE TABLE `materie` (
  `id` int(11) NOT NULL,
  `materia` varchar(24) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `materie`
--

INSERT INTO `materie` (`id`, `materia`) VALUES
(1, 'Lingua e Letteratura Ita'),
(2, 'Storia'),
(3, 'Inglese'),
(4, 'Matematica'),
(5, 'Educazione Fisica'),
(6, 'Religione'),
(11, 'Scienze Informatiche'),
(12, 'Fisica'),
(13, 'Chimica'),
(14, 'Diritto'),
(21, 'Informatica'),
(22, 'Sistemi e Reti'),
(23, 'Tecnologie'),
(24, 'Elettronica'),
(25, 'Gestione Progetto');

-- --------------------------------------------------------

--
-- Struttura della tabella `studenti`
--

CREATE TABLE `studenti` (
  `matricola` int(11) NOT NULL,
  `cognome` varchar(30) NOT NULL,
  `nome` varchar(30) NOT NULL,
  `user` varchar(20) NOT NULL,
  `pass` varchar(32) NOT NULL DEFAULT '5f4dcc3b5aa765d61d8327deb882cf99',
  `classe` varchar(6) NOT NULL,
  `residenza` varchar(30) NOT NULL,
  `indrizzo` varchar(40) NOT NULL,
  `immagine` varchar(30) NOT NULL DEFAULT 'user.jpg',
  `docente` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `studenti`
--

INSERT INTO `studenti` (`matricola`, `cognome`, `nome`, `user`, `pass`, `classe`, `residenza`, `indrizzo`, `immagine`, `docente`) VALUES
(1000, 'docente', 'docente', 'docente', '5f4dcc3b5aa765d61d8327deb882cf99', '', 'Fossano', 'Via Roma, 13', 'user.jpg', 1),
(1001, 'rossi', 'mario', 'rossi-1001', '5f4dcc3b5aa765d61d8327deb882cf99', '1B INF', 'Fossano', 'Via Roma, 13', 'user.jpg', 0),
(1002, 'rossi', 'manlio', 'rossi-1002', '5f4dcc3b5aa765d61d8327deb882cf99', '2B INF', 'Fossano', 'Via Roma, 13', 'user.jpg', 0),
(1003, 'rossi', 'sergio', 'rossi-1003', '5f4dcc3b5aa765d61d8327deb882cf99', '3B INF', 'Fossano', 'Via Roma, 13', 'user.jpg', 0),
(1004, 'rossi', 'stella', 'rossi-1004', '5f4dcc3b5aa765d61d8327deb882cf99', '4B INF', 'Fossano', 'Via Roma, 13', 'user.jpg', 0),
(1005, 'rossi', 'fulvio', 'rossi-1005', '5f4dcc3b5aa765d61d8327deb882cf99', '5B INF', 'Fossano', 'Via Roma, 13', 'user.jpg', 0),
(1006, 'verdi', 'simone', 'verdi-1006', '5f4dcc3b5aa765d61d8327deb882cf99', '4B INF', 'Fossano', 'Via Roma, 13', 'user.jpg', 0),
(1007, 'carli', 'elia', 'carli-1007', '5f4dcc3b5aa765d61d8327deb882cf99', '4B INF', 'Fossano', 'Via Roma, 13', 'user.jpg', 0),
(1008, 'sasso', 'piero', 'sasso-1008', '5f4dcc3b5aa765d61d8327deb882cf99', '4B INF', 'Fossano', 'Via Roma, 13', 'user.jpg', 0),
(1009, 'marra', 'marina', 'marra-1009', '5f4dcc3b5aa765d61d8327deb882cf99', '4B INF', 'Fossano', 'Via Roma, 13', 'user.jpg', 0),
(1010, 'morra', 'paola', 'morra-1010', '5f4dcc3b5aa765d61d8327deb882cf99', '4B INF', 'Fossano', 'Via Roma, 13', 'user.jpg', 0),
(1011, 'senna', 'andrea', 'senna-1011', '5f4dcc3b5aa765d61d8327deb882cf99', '4B INF', 'Fossano', 'Via Roma, 13', 'user.jpg', 0),
(1012, 'curti', 'marco', 'curti-1012', '5f4dcc3b5aa765d61d8327deb882cf99', '4B INF', 'Fossano', 'Via Roma, 13', 'user.jpg', 0),
(1013, 'valle', 'anna', 'valle-1013', '5f4dcc3b5aa765d61d8327deb882cf99', '4B INF', 'Fossano', 'Via Roma, 13', 'user.jpg', 0),
(1014, 'prato', 'cinzia', 'prato-1014', '5f4dcc3b5aa765d61d8327deb882cf99', '4B INF', 'Fossano', 'Via Roma, 13', 'user.jpg', 0),
(1015, 'perla', 'irma', 'perla-1015', '5f4dcc3b5aa765d61d8327deb882cf99', '4B INF', 'Fossano', 'Via Roma, 13', 'user.jpg', 0),
(1016, 'festa', 'romano', 'festa-1016', '5f4dcc3b5aa765d61d8327deb882cf99', '4B INF', 'Fossano', 'Via Roma, 13', 'user.jpg', 0),
(1017, 'mollo', 'danilo', 'mollo-1017', '5f4dcc3b5aa765d61d8327deb882cf99', '4B INF', 'Fossano', 'Via Roma, 13', 'user.jpg', 0),
(1018, 'tosco', 'stelvio', 'tosco-1018', '5f4dcc3b5aa765d61d8327deb882cf99', '4B INF', 'Fossano', 'Via Roma, 13', 'user.jpg', 0),
(1019, 'racca', 'elena', 'racca-1019', '5f4dcc3b5aa765d61d8327deb882cf99', '4B INF', 'Fossano', 'Via Roma, 13', 'user.jpg', 0),
(1020, 'russo', 'flavio', 'russo-1020', '5f4dcc3b5aa765d61d8327deb882cf99', '4B INF', 'Fossano', 'Via Roma, 13', 'user.jpg', 0);

-- --------------------------------------------------------

--
-- Struttura della tabella `voti`
--

CREATE TABLE `voti` (
  `id` int(11) NOT NULL,
  `matricola` int(11) NOT NULL,
  `data` date NOT NULL,
  `voto` float NOT NULL,
  `materia` int(11) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `voti`
--

INSERT INTO `voti` (`id`, `matricola`, `data`, `voto`, `materia`) VALUES
(1, 1001, '2023-02-25', 6, 1),
(2, 1002, '2023-02-25', 6, 1);

-- --------------------------------------------------------

--
-- Struttura della tabella `argomenti`
--

CREATE TABLE `argomenti` (
  `id` int(11) NOT NULL,
  `classe` varchar(6) NOT NULL,
  `data` date NOT NULL,
  `materia` int(11) NOT NULL,
  `argomento` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `argomenti`
--

INSERT INTO `argomenti` (`id`, `classe`, `data`, `materia`, `argomento`) VALUES
(1, '1B INF', '2023-02-25', 12, 'Le leggi della dinamica'),
(2, '1B INF', '2023-02-27', 12, 'Termodinamcia');

-- --------------------------------------------------------

--
-- Struttura della tabella `assenze`
--

CREATE TABLE `assenze` (
  `id` int(11) NOT NULL,
  `matricola` int(11) NOT NULL,
  `data` date NOT NULL,
  `giustificato` tinyint(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `assenze`
--

INSERT INTO `assenze` (`id`, `matricola`, `data`, `giustificato`) VALUES
(1, 1001, '2023-02-25', 0),
(2, 1002, '2023-02-26', 0);

-- --------------------------------------------------------

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `argomenti`
--
ALTER TABLE `argomenti`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `assenze`
--
ALTER TABLE `assenze`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `classi`
--
ALTER TABLE `classi`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `nomeClasseIndex` (`nome`);

--
-- Indici per le tabelle `materie`
--
ALTER TABLE `materie`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `studenti`
--
ALTER TABLE `studenti`
  ADD PRIMARY KEY (`matricola`);

--
-- Indici per le tabelle `voti`
--
ALTER TABLE `voti`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `argomenti`
--
ALTER TABLE `argomenti`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT per la tabella `assenze`
--
ALTER TABLE `assenze`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT per la tabella `classi`
--
ALTER TABLE `classi`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT per la tabella `materie`
--
ALTER TABLE `materie`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT per la tabella `studenti`
--
ALTER TABLE `studenti`
  MODIFY `matricola` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=1021;

--
-- AUTO_INCREMENT per la tabella `voti`
--
ALTER TABLE `voti`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
