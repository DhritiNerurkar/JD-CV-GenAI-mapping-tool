import uuid
from flask import Blueprint, request, jsonify, current_app

bp = Blueprint('jds', __name__)

@bp.route('/', methods=['GET'])
def get_jds():
    jds = current_app.load_jds()
    return jsonify(jds)

@bp.route('/', methods=['POST'])
def add_jd():
    # ... (keep existing add_jd code) ...
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    title = data.get('title')
    description = data.get('description')

    if not title or not description:
        return jsonify({"error": "Missing title or description"}), 400

    jds = current_app.load_jds()
    new_jd = {
        "id": str(uuid.uuid4()), # Generate unique ID
        "title": title,
        "description": description
    }
    jds.append(new_jd)
    current_app.save_jds(jds)
    current_app.logger.info(f"Added new JD: {new_jd['id']} - {new_jd['title']}")
    return jsonify(new_jd), 201

# --- NEW UPDATE ROUTE ---
@bp.route('/<jd_id>', methods=['PUT'])
def update_jd(jd_id):
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 400

    data = request.get_json()
    title = data.get('title')
    description = data.get('description')

    if not title or not description:
        return jsonify({"error": "Missing title or description"}), 400

    jds = current_app.load_jds()
    updated = False
    updated_jd_data = None
    for jd in jds:
        if jd.get('id') == jd_id:
            jd['title'] = title
            jd['description'] = description
            updated = True
            updated_jd_data = jd # Store the updated data to return
            break # Exit loop once found and updated

    if updated:
        current_app.save_jds(jds)
        current_app.logger.info(f"Updated JD: {jd_id} - {title}")
        return jsonify(updated_jd_data), 200 # Return the updated JD object
    else:
        current_app.logger.warning(f"Attempted to update non-existent JD: {jd_id}")
        return jsonify({"error": "JD not found"}), 404
# --- END NEW UPDATE ROUTE ---


@bp.route('/<jd_id>', methods=['DELETE'])
def delete_jd(jd_id):
    # ... (keep existing delete_jd code) ...
    jds = current_app.load_jds()
    initial_length = len(jds)
    jds_filtered = [jd for jd in jds if jd.get('id') != jd_id]

    if len(jds_filtered) < initial_length:
        current_app.save_jds(jds_filtered)
        current_app.logger.info(f"Deleted JD: {jd_id}")
        return jsonify({"message": "JD deleted successfully"}), 200
    else:
        current_app.logger.warning(f"Attempted to delete non-existent JD: {jd_id}")
        return jsonify({"error": "JD not found"}), 404