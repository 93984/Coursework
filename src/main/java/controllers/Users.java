package controllers;

import org.glassfish.jersey.media.multipart.FormDataParam;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import server.Main;

import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.UUID;

@Path("users/")
@Consumes(MediaType.MULTIPART_FORM_DATA)
@Produces(MediaType.APPLICATION_JSON)

public class Users {

    @GET
    @Path("list")

    public String UsersList() {
        System.out.println("Invoked Users.UsersList()");
        JSONArray response = new JSONArray();

        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT UserID, UserName FROM Users");
            ResultSet results = ps.executeQuery();

            while (results.next()) {
                JSONObject row = new JSONObject();
                row.put("UserID", results.getString(1));
                row.put("UserName", results.getString(2));
                response.add(row);
            } return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to list items.  Error code xx.\"}";
        }
    }

    @GET
    @Path("get/{UserID}")

    public String UsersGet(@PathParam("UserID") String UserID) {
        System.out.println("Invoked Users.UsersGet() with UserID " + UserID);

        try {
            PreparedStatement ps = Main.db.prepareStatement("SELECT UserName, Token FROM Users WHERE UserID = ?");
            ps.setString(1, UserID);
            ResultSet results = ps.executeQuery();
            JSONObject response = new JSONObject();

            if (results.next()) {
                response.put("UserID", UserID);
                response.put("UserName", results.getString(1));
                response.put("Token", results.getInt(2));
            } return response.toString();
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to get item, please see server console for more info.\"}";
        }
    }

    @POST
    @Path("add")

    public String UsersAdd(@FormDataParam("UserID") String UserID, @FormDataParam("UserName") String UserName, @FormDataParam("UserName") String Password) {
        System.out.println("Invoked Users.UsersAdd()");

        try {
            PreparedStatement ps = Main.db.prepareStatement("INSERT INTO Users (UserID, UserName, Password) VALUES (?, ?, ?)");
            ps.setString(1, UserID);
            ps.setString(2, UserName);
            ps.setString(3, Password);
            ps.execute();
            return "{\"OK\": \"Added user.\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to create new item, please see server console for more info.\"}";
        }
    }

    @POST
    @Path("update")

    public String UsersUpdate(@FormDataParam("UserID") String UserID, @FormDataParam("UserName") String UserName) {

        try {
            System.out.println("Invoked Users.UsersUpdate/update UserID=" + UserID);
            PreparedStatement ps = Main.db.prepareStatement("UPDATE Users SET UserName = ? WHERE UserID = ?");
            ps.setString(1, UserName);
            ps.setString(2, UserID);
            ps.execute();
            return "{\"OK\": \"Users updated\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to update item, please see server console for more info.\"}";
        }
    }

    @POST
    @Path("delete/{UserID}")
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)

    public String UsersDelete(@PathParam("UserID") String UserID) throws Exception {
        System.out.println("Invoked Users.UsersDelete()");

        if (UserID == null) {
            throw new Exception("UserID is missing in the HTTP request's URL.");
        }

        try {
            PreparedStatement ps = Main.db.prepareStatement("DELETE FROM Users WHERE UserID = ?");
            ps.setString(1, UserID);
            ps.execute();
            return "{\"OK\": \"User deleted\"}";
        } catch (Exception exception) {
            System.out.println("Database error: " + exception.getMessage());
            return "{\"Error\": \"Unable to delete item, please see server console for more info.\"}";
        }
    }

    @POST
    @Path("login")
    public String UsersLogin(@FormDataParam("UserName") String UserName, @FormDataParam("PassWord") String PassWord) {
        System.out.println("Invoked loginUser() on path users/login");

        try {
            PreparedStatement ps1 = Main.db.prepareStatement("SELECT PassWord FROM Users WHERE UserName = ?");
            ps1.setString(1, UserName);
            ResultSet loginResults = ps1.executeQuery();

            if (loginResults.next()) {
                String correctPassword = loginResults.getString(1);

                if (PassWord.equals(correctPassword)) {
                    String Token = UUID.randomUUID().toString();
                    PreparedStatement ps2 = Main.db.prepareStatement("UPDATE Users SET Token = ? WHERE UserName = ?");
                    ps2.setString(1, Token);
                    ps2.setString(2, UserName);
                    ps2.executeUpdate();
                    JSONObject userDetails = new JSONObject();
                    userDetails.put("UserName", UserName);
                    userDetails.put("Token", Token);
                    return userDetails.toString();
                } else {
                    return "{\"Error\": \"Incorrect password!\"}";
                }
            } else {
                return "{\"Error\": \"Incorrect username.\"}";
            }
        } catch (Exception exception) {
            System.out.println("Database error during /users/login: " + exception.getMessage());
            return "{\"Error\": \"Server side error!\"}";
        }
    }

    @POST
    @Path("logout")
    public static String logout(@CookieParam("Token") String Token){

        try {
            System.out.println("users/logout "+ Token);
            PreparedStatement ps = Main.db.prepareStatement("SELECT UserID FROM Users WHERE Token=?");
            ps.setString(1, Token);
            ResultSet logoutResults = ps.executeQuery();

            if (logoutResults.next()){
                int UserID = logoutResults.getInt(1);
                //Set the token to null to indicate that the user is not logged in
                PreparedStatement ps1 = Main.db.prepareStatement("UPDATE Users SET Token = NULL WHERE UserID = ?");
                ps1.setInt(1, UserID);
                ps1.executeUpdate();
                return "{\"status\": \"OK\"}";
            } else {
                return "{\"error\": \"Invalid token!\"}";
            }
        } catch (Exception ex) {
            System.out.println("Database error during /users/logout: " + ex.getMessage());
            return "{\"error\": \"Server side error!\"}";
        }
    }

    //returns the userID with the token value
    public static int validToken(String Token) {
        System.out.println("Invoked User.validateToken(), Token value " + Token);

        try {
            PreparedStatement statement = Main.db.prepareStatement("SELECT UserID FROM Users WHERE Token = ?");
            statement.setString(1, Token);
            ResultSet resultSet = statement.executeQuery();
            System.out.println("userID is " + resultSet.getInt("UserID"));
            return resultSet.getInt("UserID");  //Retrieve by column name  (should really test we only get one result back!)
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return -1;  //rogue value indicating error
        }
    }
}
