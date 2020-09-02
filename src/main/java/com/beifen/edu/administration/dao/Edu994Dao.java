package com.beifen.edu.administration.dao;

import com.beifen.edu.administration.domian.Edu994;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface Edu994Dao extends JpaRepository<Edu994, Long>, JpaSpecificationExecutor<Edu994> {


	@Transactional
	@Modifying
	@Query(value = "delete from edu994 where Edu990_ID =?1", nativeQuery = true)
	void deleteByEdu990Id(String toString);

	@Query(value = "select e.Edu104_ID from Edu994 e where e.edu990_ID = ?1",nativeQuery = true)
	List<String> findAllDepartmentIds(String userId);


}
