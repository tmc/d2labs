package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"net/url"
	"os"
	"strings"

	"github.com/google/go-github/v53/github"
	"golang.org/x/oauth2"
	gh "golang.org/x/oauth2/github"
)

var githubConnect *oauth2.Config

func initializeGithubOauthConfig() {
	githubConnect = &oauth2.Config{
		ClientID:     os.Getenv("GITHUB_CLIENT_ID"),
		ClientSecret: os.Getenv("GITHUB_CLIENT_SECRET"),
		Scopes:       []string{"user:email"},
		Endpoint:     gh.Endpoint,
	}
}

func handleGitHubLogin(w http.ResponseWriter, r *http.Request) {
	fmt.Println("handleGitHubLogin", githubConnect)
	url := githubConnect.AuthCodeURL("")
	http.Redirect(w, r, url, http.StatusTemporaryRedirect)
}

func handleGitHubCallback(w http.ResponseWriter, r *http.Request) {
	code := r.URL.Query().Get("code")
	token, err := githubConnect.Exchange(oauth2.NoContext, code)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	response, err := http.Get("https://api.github.com/user?access_token=" + token.AccessToken)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer response.Body.Close()
	content, err := ioutil.ReadAll(response.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	var user *github.User
	json.Unmarshal(content, &user)
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(user)
}

func handleGitHubAuthCode(w http.ResponseWriter, r *http.Request) {
	session, _ := sessionStore.Get(r, "s")

	code := r.URL.Query().Get("code")
	session.Values["github-auth"] = code
	tokenData, err := exchangeCode(code)
	if err != nil {
		fmt.Fprintf(w, "Error occurred: %s", err)
		return
	}
	if tokenData.AccessToken != "" {
		userInfo, err := userInfo(tokenData.AccessToken)
		if err != nil {
			fmt.Fprintf(w, "Error occurred: %s", err)
			return
		}
		session.Values["github-token"] = tokenData.AccessToken
		session.Values["github-login"] = userInfo.Login
		session.Values["github-name"] = userInfo.Name
	} else {
		fmt.Fprintf(os.Stderr, "Authorized, but unable to exchange code %s for token.", code)
	}

	session.Save(r, w)
	http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
}

type Response struct {
	AccessToken string `json:"access_token"`
	Login       string `json:"login"`
	Name        string `json:"name"`
}

func parseResponse(response *http.Response) (Response, error) {
	var res Response
	body, err := ioutil.ReadAll(response.Body)
	if err != nil {
		return res, err
	}
	fmt.Println(string(body))
	if response.StatusCode != http.StatusOK {
		fmt.Println(string(body))
		return res, nil
	}
	err = json.Unmarshal(body, &res)
	return res, err
}

func exchangeCode(code string) (Response, error) {
	params := url.Values{}
	params.Add("client_id", githubConnect.ClientID)
	params.Add("client_secret", githubConnect.ClientSecret)
	params.Add("code", code)
	req, err := http.NewRequest("POST", "https://github.com/login/oauth/access_token", strings.NewReader(params.Encode()))
	if err != nil {
		return Response{}, err
	}
	req.Header.Add("Accept", "application/json")
	req.Header.Add("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return Response{}, err
	}
	return parseResponse(resp)
}

func userInfo(token string) (Response, error) {
	client := &http.Client{}
	req, err := http.NewRequest("GET", "https://api.github.com/user", nil)
	if err != nil {
		return Response{}, err
	}
	req.Header.Add("Accept", "application/json")
	req.Header.Add("Content-Type", "application/json")
	req.Header.Add("Authorization", "Bearer "+token)
	resp, err := client.Do(req)
	if err != nil {
		return Response{}, err
	}
	return parseResponse(resp)
}
