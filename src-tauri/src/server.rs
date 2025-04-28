use crate::helpers::is_valid_xorname;
use futures::stream::TryStreamExt;
use futures::StreamExt;
use std::collections::HashMap;
use std::convert::Infallible;
use std::path::PathBuf;
use tauri::Emitter;
use warp::multipart::{FormData, Part};
use warp::{http::StatusCode, reply::Reply, Filter};

pub async fn run(handle: tauri::AppHandle) {
    let download_handle = handle.clone();
    let upload_handle = handle.clone();

    let xorname_param = warp::query::<HashMap<String, String>>().and_then({
        // let handle = handle.clone();
        move |params: HashMap<String, String>| {
            let handle = download_handle.clone();
            async move {
                if let Some(xorname) = params.get("xorname") {
                    if is_valid_xorname(xorname) {
                        let _ = handle.emit("download-file", xorname.to_string());
                        Ok::<_, warp::Rejection>(Box::new(warp::reply::json(&serde_json::json!({
                            "message": "Download triggered"
                        }))) as Box<dyn Reply>)
                    } else {
                        Ok(Box::new(warp::reply::json(&serde_json::json!({
                            "error": "Invalid xorname"
                        }))) as Box<dyn Reply>)
                    }
                } else {
                    Ok(Box::new(warp::reply::json(&serde_json::json!({
                        "error": "Missing xorname parameter"
                    }))) as Box<dyn Reply>)
                }
            }
        }
    });

    let download_route = warp::path("download-file").and(xorname_param);

    let upload_route = warp::path("upload-file")
        .and(warp::post())
        .and(warp::multipart::form().max_length(8_000_000)) // Adjust max length as needed
        .and(with_upload_handle(upload_handle))
        .and_then(upload_handler);

    fn with_upload_handle(
        handle: tauri::AppHandle,
    ) -> impl Filter<Extract = (tauri::AppHandle,), Error = std::convert::Infallible> + Clone {
        warp::any().map(move || handle.clone())
    }

    async fn upload_handler(
        form: FormData,
        handle: tauri::AppHandle,
    ) -> Result<impl warp::Reply, Infallible> {
        let mut parts = form;

        while let Some(result) = parts.next().await {
            match result {
                Ok(part) => {
                    let filename = part.filename().unwrap_or("photo.png");
                    let filepath = format!("uploads/{}", filename);
                    println!("Got file: {}", filepath);
                    let _ = handle.emit("upload-file", filename);

                    // You can handle saving here
                }
                Err(e) => {
                    eprintln!("Error processing part: {}", e);
                }
            }
        }

        Ok(warp::reply::json(&serde_json::json!({
            "message": "Upload triggered"
        })))
    }

    // combine both routes
    let routes = download_route.or(upload_route);

    warp::serve(routes).run(([127, 0, 0, 1], 1420)).await;
}
