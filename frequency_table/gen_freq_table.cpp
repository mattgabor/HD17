#include <iostream>
#include <fstream>
#include <math.h>
#include <limits>
#include <string.h>
#include <stdio.h>
#include <stdlib.h>
#include <map>
#include <vector>
#include <algorithm>
#include <string>
#include <iterator>
#include <sstream>
#include "json.hpp"

using json = nlohmann::json;
using namespace std;


void split(const std::string &s, char delim, std::vector<std::string> &elems) {
    std::stringstream ss;
    ss.str(s);
    std::string item;
    while (std::getline(ss, item, delim)) {
        if (!item.empty()) {
            elems.push_back(item);
        }
    }
}

std::vector<std::string> split(const std::string &s, char delim) {
    std::vector<std::string> elems;
    split(s, delim, elems);
    return elems;
}


string join(const vector<string> &v, const string sep) {
    ostringstream oss;

    for(auto it = v.begin(); it != v.end(); ++it) {
        if (it == v.begin()) {
            oss << *it;
        } else {
            oss << sep << *it;
        }
    }
    return oss.str();
}

string filterChars(const string &s) {
    string res = "";
    for(uint64_t i = 0; i < s.length(); i++) {
        char c = s[i];
        if((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c == ' ')) {
            res += c;
        }
    }
    return res;
}


// ------- Helper Functions, not very interesting ----------
// From http://stackoverflow.com/questions/2602013/read-whole-ascii-file-into-c-stdstring
// 1st answer
string readWholeFile(const char *fName) {
    ifstream t(fName);
    std::string str;

    t.seekg(0, std::ios::end);   
    str.reserve(t.tellg());
    t.seekg(0, std::ios::beg);

    str.assign((std::istreambuf_iterator<char>(t)),
                std::istreambuf_iterator<char>());

    return str;
}


map<vector<string>, double> computeBigramLogFrequencies(const char *corpusName) {
    string corpusStr = filterChars(readWholeFile(corpusName));

    std::transform(corpusStr.begin(), corpusStr.end(), corpusStr.begin(), ::tolower);

    vector<string> corpus = split(corpusStr, ' ');

    // First, we count up all bigram occurences as integers
    int totalCount = 0;
    map<vector<string>, uint64_t> counts;
    for (int i = 0; i < corpus.size() - 1; i++) {
        string c1 = corpus[i];
        string c2 = corpus[i+1];
        vector<string> bigram = {c1, c2};

        counts[bigram]++;

        totalCount++;

        if(totalCount % 10000 == 0) {
            double progress = 100 * (i + 2) / corpus.size();
            printf("[%.2g%%]  Analyzed %d bigrams\n", progress, totalCount);
        }
    }


    // Then, we compute the log probabilities like so:
    // ln(P) = ln(count / totalCount) = ln(count) - ln(totalCount)
    double totalCountLog = log(totalCount);
    map<vector<string>, double> logFreqs;

    printf("Normalizing probabilities...\n");
    for (auto it = counts.begin(); it != counts.end(); ++it) {
        vector<string> bigram = it->first;
        uint64_t count = it->second;
        if (count == 0) {
            logFreqs[bigram] = -100;
        } else {
            logFreqs[bigram] = log(count) - totalCountLog;
        }
    }

    return logFreqs;
}



int main(int argc, char **argv) {

    if(argc != 3) {
        cout << "Usage: ./substitution [corpus] [outputJSON]" << endl;
        return -1;
    }

    // Compute frequencies
    map<vector<string>, double> freqs = computeBigramLogFrequencies(argv[1]);


    json jsonFreq;
    for(auto it = freqs.begin(); it != freqs.end(); ++it) {
        vector<string> gram = it->first;
        string gramStr = join(gram, "-");

        jsonFreq[gramStr] = it->second;
    }

    ofstream outFile(argv[2]);

    cout << "Writing to JSON file..." << endl;
    outFile << jsonFreq << endl; 
}