// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Voting {
    struct Election {
        string title;
        string description;
        uint256 startDate;
        uint256 endDate;
        bool exists;
    }
    struct Candidate {
        string name;
        string party;
        string manifesto;
        string image;
        uint256 voteCount;
        bool exists;
    }
    struct Voter {
        bool voted;
        uint256 votedCandidate;
        bool exists;
    }

    uint256 public electionCount;
    mapping(uint256 => Election) public elections;
    mapping(uint256 => mapping(uint256 => Candidate)) public candidates; // electionId => candidateId => Candidate
    mapping(uint256 => uint256) public candidateCount; // electionId => count
    mapping(uint256 => mapping(address => Voter)) public voters; // electionId => voter address => Voter

    event ElectionCreated(uint256 indexed electionId, string title);
    event CandidateAdded(uint256 indexed electionId, uint256 candidateId, string name);
    event VoteCast(uint256 indexed electionId, uint256 candidateId, address voter);

    function createElection(string memory title, string memory description, uint256 startDate, uint256 endDate) public returns (uint256) {
        electionCount++;
        elections[electionCount] = Election(title, description, startDate, endDate, true);
        emit ElectionCreated(electionCount, title);
        return electionCount;
    }

    function addCandidate(uint256 electionId, string memory name, string memory party, string memory manifesto, string memory image) public returns (uint256) {
        require(elections[electionId].exists, "Election does not exist");
        candidateCount[electionId]++;
        uint256 cId = candidateCount[electionId];
        candidates[electionId][cId] = Candidate(name, party, manifesto, image, 0, true);
        emit CandidateAdded(electionId, cId, name);
        return cId;
    }

    function vote(uint256 electionId, uint256 candidateId) public {
        require(elections[electionId].exists, "Election does not exist");
        require(candidates[electionId][candidateId].exists, "Candidate does not exist");
        require(!voters[electionId][msg.sender].voted, "Already voted");
        voters[electionId][msg.sender] = Voter(true, candidateId, true);
        candidates[electionId][candidateId].voteCount++;
        emit VoteCast(electionId, candidateId, msg.sender);
    }

    function getResults(uint256 electionId) public view returns (uint256[] memory) {
        require(elections[electionId].exists, "Election does not exist");
        uint256 cCount = candidateCount[electionId];
        uint256[] memory results = new uint256[](cCount);
        for (uint256 i = 1; i <= cCount; i++) {
            results[i-1] = candidates[electionId][i].voteCount;
        }
        return results;
    }

    function hasVoted(uint256 electionId, address voter) public view returns (bool) {
        return voters[electionId][voter].voted;
    }
}
